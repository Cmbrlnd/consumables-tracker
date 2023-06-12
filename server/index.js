const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

//Connect to MongoDB cluster
mongoose
  .connect(
    "mongodb+srv://" +
    process.env.ATLAS_USERNAME +
    ":" +
    process.env.ATLAS_PASSWORD +
    "@cluster0.jol3axi.mongodb.net/consumables-tracker?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log("Database not connected " + err);
  });

// Get the default connection
const db = mongoose.connection;

// Get the Consumable model
const Consumable = require("./models/consumable");

//Get consumables
app.get("/get-consumables", async (req, res) => {
  const consumable = Consumable.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//Get model
app.get("/get-consumable/:model", async (req, res) => {
  const model = req.params.model;
  console.log(model)
  const modelData = Consumable.findOne({ model: model }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      // console.log(modelData)
      res.send(result);
    }
  });
});

//Get type
app.get("/get-type/:type", async (req, res) => {
  const type = req.params.type;
  console.log(type)
  const typeData = Consumable.find({ type: type }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      // console.log(typeData)
      res.send(result);
    }
  });
});

//Add a new consumable
app.post("/add-consumable", async (req, res) => {
  try {
    const consumable = await Consumable.create({
      type: req.body.type,
      make: req.body.make,
      model: req.body.model,
      minQty: req.body.minQty,
      maxQty: req.body.maxQty,
      currentQty: req.body.currentQty,
    });
  } catch (err) {
    console.log(err);
  }
  res.send("Consumable added successfully.");
});

//Edit the quantity of an existing consumable
app.put("/update-quantity", async (req, res) => {
  const id = req.body.id
  const quantity = req.body.quantity
  try {
    await Consumable.updateOne({ _id: id }, { currentQty: quantity });
  } catch (err) {
    console.log(err)
  }
  res.send("updated")
})

//Edit an existing consumable
app.put("/edit-consumable", async (req, res) => {

  console.log(req.body)

  const id = req.body.id
  const consumable = req.body
  // const quantity = req.body.quantity
  try {
    await Consumable.updateOne({ _id: id }, { $set: consumable });
  } catch (err) {
    console.log(err)
  }
  res.send("updated")
})

// Delete a consumable
app.delete("/delete-consumable/:model", async (req, res) => {
  const model = req.params.model;

  try {
    await Consumable.deleteOne({ model: model });
    res.status(200).send("Consumable deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting consumable");
  }
});

app.get('/send-email', async (req, res) => {
  // Retrieve consumables data from the database
  const consumables = await Consumable.find();

  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Consumables');

  // Add column headers to the worksheet
  worksheet.addRow(['Type', 'Make', 'Model', 'Min Qty', 'Max Qty', 'Current Qty']);

  // Add data rows to the worksheet
  consumables.forEach((consumable) => {
    const { type, make, model, minQty, maxQty, currentQty } = consumable;
    const row = worksheet.addRow([type, make, model, minQty, maxQty, currentQty]);

    // Check if currentQty is less than minQty and apply formatting to the row
    if (currentQty <= minQty) {
      const rowNumber = row.number;

      // Iterate over each cell in the row
      for (let i = 1; i <= 6; i++) {
        const cell = worksheet.getCell(`${String.fromCharCode(64 + i)}${rowNumber}`);

        // Apply fill color to the cell
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' }, // Red color
        };
      }
    }
  });

  // Generate a temporary file path to save the Excel file
  const tempDirectory = path.join(__dirname, 'temp');
  const tempFilePath = path.join(tempDirectory, 'consumables.xlsx');

  // Create the temp directory if it doesn't exist
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory);
  }

  console.log(tempFilePath)

  // Save the workbook to the temporary file path
  await workbook.xlsx
    .writeFile(tempFilePath)
    .then(() => {
      console.log('Excel file saved successfully.');
    })
    .catch((error) => {
      console.log('Error saving Excel file:', error);
    });

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: process.env.EMAIL_ADDRESS, // Use the email addres from .env file
      pass: process.env.EMAIL_PASSWORD, // Use the password from .env file
    },
  });

  // Generate the current date
const currentDate = new Date();

// Format the date as desired (e.g., DD-MM-YYYY)
const day = currentDate.getDate().toString().padStart(2, "0");
const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const year = currentDate.getFullYear().toString();
const formattedDate = `${day}-${month}-${year}`;

// Generate the filename with the dynamic date
const filename = `ILNG_Consumables_${formattedDate}.xlsx`;

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: 'jesse.cumberland@hotmail.com',
    subject: 'Consumables Report',
    text: 'Attached is the consumables report.',
    attachments: [
      {
        path: tempFilePath,
        filename: filename
      },
    ],
  };

  // Send the email with the attached Excel file
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);

      // Delete the temporary file after sending the email
      fs.unlinkSync(tempFilePath);
      res.send('Email sent successfully!');
    }
  });

  res.send('Email sent successfully!');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
