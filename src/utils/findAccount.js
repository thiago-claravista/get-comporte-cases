const selectRows = require("../database/selectRows");

const findAccount = async (matchColumn, value) => {
  let conditions;

  if (Array.isArray(matchColumn)) {
    conditions = matchColumn.map((col) => `${col} = '${value}'`).join(", ");
  }

  try {
    const [foundAccount] = await selectRows(
      "Accounts",
      conditions || `${matchColumn} = '${value}'`,
      1,
      1
    );

    return foundAccount;
  } catch (error) {
    console.log(
      `Erro ao buscar conta de usuário no banco de dados! ${matchColumn} = '${value}'`
    );
    console.log(error);
  }
};

module.exports = findAccount;
