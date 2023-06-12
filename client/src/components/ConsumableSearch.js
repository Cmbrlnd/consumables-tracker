import classes from "./ConsumableSearch.module.css";
import { Link } from "react-router-dom";

const ConsumableSearch = ({
  setConsumableSearch,
  consumables,
  consumableSearch,
  title,
  listProperty,
  edit = false
}) => {
  // Create an object to group consumables by their type
  const typeObj = consumables.reduce(function (r, a) {
    // If the type does not exist as a key in the object, create an empty array for it
    r[a.type] = r[a.type] || [];
    // Push the consumable into the corresponding type array
    r[a.type].push(a);
    return r;
  }, Object.create(null));

  // Get an array of consumable types by extracting the keys from the typeObj object
  var consumableTypes = Object.keys(typeObj).map((key) => key);

  return (
    <div className={classes.modelSearchContainer}>
      <h2 className={classes.searchHeader}>{title}</h2>
      <input
        className={classes.searchInput}
        type="text"
        name="modelSearch"
        onChange={(event) => {
          setConsumableSearch(event.target.value);
        }}
      />
      <div className={classes.resultContainer}>
        <ul>
          {listProperty === "model" && // Check if the listProperty is equal to "model"
            consumables
              .filter((val) => {
                // Filter the consumables array based on the search criteria
                if (consumableSearch === "") {
                  return val; // If the search is empty, return all consumables
                } else if (
                  val[listProperty]
                    .toUpperCase()
                    .includes(consumableSearch.toUpperCase())
                ) {
                  return val; // If the consumable's model property contains the search string (case-insensitive), return it
                }
                return false; // If the consumable doesn't match the search criteria, filter it out
              })
              .map((consumable) => {
                // Map over the filtered consumables to render them
                if (edit) {
                  // If the 'edit' flag is true, render the consumable as a link to the edit page
                  return (
                    <li key={consumable._id}>
                      <Link
                        to={{
                          pathname: `/edit/${consumable[listProperty]}`,
                        }}
                      >
                        {consumable[listProperty]}
                      </Link>
                    </li>
                  );
                }
                else {
                  // If the 'edit' flag is false, render the consumable as a link to the consumable details page
                  return (
                    <li key={consumable._id}>
                      <Link
                        to={{
                          pathname: `/consumable/${consumable[listProperty]}`,
                        }}
                      >
                        {consumable[listProperty]}
                      </Link>
                    </li>
                  );
                }

              })}

          {listProperty === "type" && // Check if the listProperty is equal to "type"
            consumableTypes
              .filter((val) => {
                // Filter the consumableTypes array based on the search criteria
                if (consumableSearch === "") {
                  return val; // If the search is empty, return all consumable types
                } else if (
                  val.toUpperCase().includes(consumableSearch.toUpperCase())
                ) {
                  return val; // If the consumable type contains the search string (case-insensitive), return it
                }
                return false; // If the consumable type doesn't match the search criteria, filter it out
              })
              .map((type) => {
                // Map over the filtered consumable types to render them
                return (
                  <li key={type}>
                    <Link to={{ pathname: `/type/${type}` }}>{type}</Link>
                  </li>
                );
              })}
        </ul>
      </div>
    </div>
  );
};

export default ConsumableSearch;
