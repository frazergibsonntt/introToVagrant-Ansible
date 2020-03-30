// Remove function to remove selected table row from the Table
const removeRow = () => {
  let rowCount = document.getElementById("table-data").rows.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < rowCount; i++) {
    // eslint-disable-next-line no-loop-func
    document.getElementById("table-data").rows[i].onclick = () => {
      document.getElementById("table-data").deleteRow(i);

      // eslint-disable-next-line no-plusplus
      rowCount--;
    };
  }
};

const onSubmit = event => {
  event.preventDefault();

  const numberOne = event.target.number_one.value;
  const numberTwo = event.target.number_two.value;
  const mathOperations = event.target.math_operations.value;

  // Request object construction
  const requestData = {
    expr: `${numberOne} ${mathOperations} ${numberTwo}`,
    precision: 14
  };

  // Making a POST request using FETCH API
  fetch("http://api.mathjs.org/v4/", {
    method: "POST",
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      const { result } = data;

      // Getting the Table by ID and constructing new rows
      const table = document.getElementById("table-data");
      const numberOfRows = table.rows.length - 1;
      const currentRow = table.insertRow(numberOfRows + 1);
      const firstCell = currentRow.insertCell(0);
      const secondtCell = currentRow.insertCell(1);
      const thirdCell = currentRow.insertCell(2);
      const forthCell = currentRow.insertCell(3);
      const fifthCell = currentRow.insertCell(4);
      const sixthCell = currentRow.insertCell(5);

      let yesOrNo = "";

      // A Function for Generating Random Number
      const generateRandomNumber = () => {
        const randomNumber = Math.round(Math.random());

        if (randomNumber === 1) {
          yesOrNo = "No";
          currentRow.classList.add("bg-no");
          return Math.ceil(Math.random() * 4000);
        }
        yesOrNo = "Yes";
        currentRow.classList.add("bg-yes");
        return result;
      };

      // Adding Dynamic Data to the Table Row
      firstCell.innerHTML = `${numberOne}`;
      secondtCell.innerHTML = `${numberTwo}`;
      thirdCell.innerHTML = `${generateRandomNumber()}`;
      forthCell.innerHTML = `${result}`;
      fifthCell.innerHTML = yesOrNo;
      sixthCell.innerHTML = `<span class="remove" onclick="removeRow()">X</span>`;
    })
    .catch(error => {
      console.log("Something when wrong", error);
    });
};

// Getting the form by ID
const calculate = document.querySelector("#calculateForm");

// Adding Submit EvenlIstener to the form
calculate.addEventListener("submit", onSubmit);

// export default { removeRow, generateRandomNumber };
