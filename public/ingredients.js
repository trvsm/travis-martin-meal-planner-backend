/** Testing: convert recipe to array
 * array will have associated ingredient & measure
 *
 * unsure if better to have each ingredient as array or object.
 *
 * array methods seem more appropriate for next step of coding
 *
 */

/** Sample meal
 * input: object
 *
 * output: just ingredients within, ingredient & measure associated
 */
const testMeal = {
  idMeal: "52955",
  strMeal: "Egg Drop Soup",
  strDrinkAlternate: null,
  strCategory: "Vegetarian",
  strArea: "Chinese",
  strInstructions:
    "In a wok add chicken broth and wait for it to boil.\r\nNext add salt, sugar, white pepper, sesame seed oil.\r\nWhen the chicken broth is boiling add the vegetables to the wok.\r\nTo thicken the sauce, whisk together 1 Tablespoon of cornstarch and 2 Tablespoon of water in a bowl and slowly add to your soup until it's the right thickness.\r\nNext add 1 egg slightly beaten with a knife or fork and add it to the soup slowly and stir for 8 seconds\r\nServe the soup in a bowl and add the green onions on top.",
  strMealThumb: "https://www.themealdb.com/images/media/meals/1529446137.jpg",
  strTags: "Soup,Baking,Calorific",
  strYoutube: "https://www.youtube.com/watch?v=9XpzHm9QpZg",
  strIngredient1: "Chicken Stock",
  strIngredient2: "Salt",
  strIngredient3: "Sugar",
  strIngredient4: "Pepper",
  strIngredient5: "Sesame Seed Oil",
  strIngredient6: "Peas",
  strIngredient7: "Mushrooms",
  strIngredient8: "Cornstarch",
  strIngredient9: "Water",
  strIngredient10: "Spring Onions",
  strIngredient11: "",
  strIngredient12: "",
  strIngredient13: "",
  strIngredient14: "",
  strIngredient15: "",
  strIngredient16: "",
  strIngredient17: "",
  strIngredient18: "",
  strIngredient19: "",
  strIngredient20: "",
  strMeasure1: "3 cups ",
  strMeasure2: "1/4 tsp",
  strMeasure3: "1/4 tsp",
  strMeasure4: "pinch",
  strMeasure5: "1 tsp ",
  strMeasure6: "1/3 cup",
  strMeasure7: "1/3 cup",
  strMeasure8: "1 tbs",
  strMeasure9: "2 tbs",
  strMeasure10: "1/4 cup",
  strMeasure11: "",
  strMeasure12: "",
  strMeasure13: "",
  strMeasure14: "",
  strMeasure15: "",
  strMeasure16: "",
  strMeasure17: "",
  strMeasure18: "",
  strMeasure19: "",
  strMeasure20: "",
  strSource: "https://sueandgambo.com/pages/egg-drop-soup",
  strImageSource: null,
  strCreativeCommonsConfirmed: null,
  dateModified: null,
};

// setup array to hold ingredient names
let ingredientItems = [];

// setup array to hold measurements for each ingredient
let ingredientMeasures = [];

// arrays to hold value and unit respectively once separated
let valueOnly = [];
let unitOnly = [];

// array to hold value with fraction converted to number
let fractionFree = [];

// setup array to hold coupled ingredients & measures
let correlatedIngredients = [];

// converted will hold an entry for each ingredient
let converted = [];

// get meal in array form for manipulation
const mealEntries = Object.entries(testMeal);

// while populating combined list if there is a missing key populate with 1

// setup regular expressions for matching object fields and measurement terms
const ingredientMatch = /ingredient/i;
const measurementMatch = /measure/i;

// match any letters to separate unit from quantity
const letterMatch = /[a-z]/;

// to match dicrete quantities eg: carrot: 1, egg(s): 1
const noLetterMatch = /[^a-z]/gi;
/* ??Do I want to leave discrete unconverted??  */

// ensure cases where conversions are in measure just take first instance

// match pinch. I see examples with simply pinch or 1 pinch... any case for 2?  probably simply convert to ml

// match "can"

// case where there's numbers & letters but no matched unit eg: bread: 8 slices
// strip letters and compute as discrete

// to match pure descriptive terms eg: sprinkle, to serve
const noNumberMatch = /[^0-9^/^.]/;

/**
 * Takes an array, uses a regular expresssion to locate a group of similarly named keys, add them to a target output array
 * @param {an array, likely result of Object.entries() featuring a number of keys with similar names to extract values} inputArray
 * @param {a regular expression to match desired entries} targetKey
 * @param {a destination for the values associated with each instance of targetKey} outputArray
 */
const mapNonEmpty = (inputArray, targetKey, outputArray) => {
  inputArray.map((entry) => {
    if (entry[0].match(targetKey)) {
      if (entry[1]) {
        // if truthy; if field is not empty push the value to output.  Since this is a flattened object desired value should always be index 1.
        outputArray.push(entry[1]);
      }
    }
  });
};

/**
 * Separate array string entries of combined quantity and unit so numerical quantity can be computed
 * @param {Array} valuePlusUnit with string entries containing quantity followed by unit
 * @param {a regular expression to determine where to separate field; often will match on /[a-z]/ to separate units with english letter names} matchExpression
 * @param {Array} valueOnly to hold numerical value output. may include fractions
 * @param {Array} unitOnly to hold non-numerical output. may include weird characters
 */
const separateUnits = (
  valuePlusUnit,
  matchExpression,
  valueOutput,
  unitOutput
) => {
  valuePlusUnit.forEach((element) => {
    // exec method returns an object including index of match
    let execOutput = matchExpression.exec(element);
    // slice from start of string to index to return number. May include fractions eg 3/4.  will compute fraction to number later

    let value;
    // if no number is returned set value to 1, eg; clove => 1 clove
    if (!element.slice(0, execOutput.index)) {
      value = 1;
    } else {
      value = element.slice(0, execOutput.index);
    }
    // slice from index to end of string to return unit
    let unit;
    // if the first character is a letter should be a discrete measure eg: pinch
    if (execOutput.index === 0) {
      unit = element;
    } else {
      unit = element.slice(execOutput.index);
    }
    valueOutput.push(value.toString());
    unitOutput.push(unit);
  });
};
/**
 *
 * @param {array} nameArray  with name of field eg: <ingredient name>
 * @param {array} valueArray with value corresponding to name above
 * @param {array} unitArray  with unit corresponding to value above
 * @param {array} outputArray output where all three fields above will be grouped for further processing
 */

const correlate = (nameArray, valueArray, unitArray, outputArray) => {
  for (let i = 0; i < nameArray.length; i++) {
    // if value array is empty here set value to one eg: cinnamon stick
    if (!valueArray[i]) {
      outputArray[i] = [nameArray[i], 1, ""];
    } else {
      outputArray[i] = [nameArray[i], valueArray[i], unitArray[i]];
    }
  }
};
const convertFraction = (inputArray, outputArray) => {
  let value;
  inputArray.forEach((element) => {
    if (element.match(/[/]/g)) {
      let execOutput = /[/]/g.exec(element);
      let leadingInteger;
      let numerator;
      let denominator;
      // execOutput.index > 1 means character 0 should be integer
      if (execOutput.index > 1) {
        leadingInteger = element[0];
        // character at index preceeding / (execOutput.index) is top of fraction
        numerator = element[execOutput.index - 1];
        denominator = element[execOutput.index + 1];
        value = leadingInteger + numerator / denominator;
      }
      if (execOutput.index === 1) {
        numerator = element[execOutput.index - 1];
        denominator = element[execOutput.index + 1];
        value = numerator / denominator;
      }
    } else {
      value = element;
    }
    outputArray.push(value);
  });
};

// this function takes an array with a number of non-standardized food measurements and converts as many as possible to mL
// cases more specific to more general: kg then g, tbsp then tsp
const convertMeasures = (arrayWithMeasures, indexOfValue, indexOfUnit) => {
  arrayWithMeasures.forEach((element) => {
    const quantity = element[indexOfValue];
    const unit = element[indexOfUnit];
    let value;
    if (unit === "") {
      // discrete quantity; call spoonacular for a conversion using ingredient name
      console.log(`call Spoonacular`);
    }
    if (unit.match(/pinch/i)) {
      value = quantity * 0.31;
    }
    if (unit.match(/cup/gi)) {
      value = quantity * 237;
    }
    if (unit.match(/t[ab][bls]/gi)) {
      // expression to match tablespoon: tbs, tbsp, tblsp
      value = quantity * 15;
    }
    if (unit.match(/t[es][ap]/gi)) {
      // expression to match teaspoon: tsp, teaspoon
      value = quantity * 5;
    } else {
      // add item to an array that will be returned to user to ask what to do
      console.log(element);
    }
    element[indexOfValue] = value;
    element[indexOfUnit] = "mL";
  });
};
// possibly improve this by populating an empty array instead of messing with an existing one

// map through recipe, add ingredient names to ingredientItems array
mapNonEmpty(mealEntries, ingredientMatch, ingredientItems);

// map through again: measurements to ingredientMeasures array
mapNonEmpty(mealEntries, measurementMatch, ingredientMeasures);

// loop through ingredientMeasures, separate quantity & unit into two fields
separateUnits(ingredientMeasures, letterMatch, valueOnly, unitOnly);

// next step convert fractions to number
convertFraction(valueOnly, fractionFree);

// create an array of arrays where each ingredient is matched with appropriate measure & units. In case of non numeric units eg: pinch measure = 1.
correlate(ingredientItems, fractionFree, unitOnly, correlatedIngredients);

// next step put all measures in a standardized unit
convertMeasures(correlatedIngredients, 1, 2);
// success!  all ingredients converted to mL.  This is not perfectly accurate but will serve to build a reasonable shopping list!
