const momo = require("mtn-momo");

exports.momopay = async (req, res) => {
  const { total, tel } = req.body;
  const totalAmount = String(total);
  const { Collections } = momo.create({
    callbackHost: "localhost:5000",
  });

  const collections = Collections({
    userSecret: "3da6149e264b4b0abbe5cdb3aaf63190",
    userId: "d66e82e7-b843-4d5b-b79f-403a71d70c34",
    primaryKey: "afe3bfebff6747a9b21e9080683a6a02",
  });

  // Request to pay
  const transactionId = await collections.requestToPay({
    amount: totalAmount,
    currency: "EUR",
    externalId: "123456",
    payer: {
      partyIdType: "MSISDN",
      partyId: tel,
    },
    payerMessage: "testing",
    payeeNote: "hello",
  });

  if (!transactionId)
    return res.status(400).json({ success: false, msg: "no transaction id" });
  const transaction = await collections.getTransaction(transactionId);
  if (!transaction)
    return res.status(400).json({ success: false, msg: "transaction failed" });
  const accountBalance = await collections.getBalance();
  return res.json({
    success: true,
    msg: "purchase successfully completed",
    transactionId,
    transaction,
    accountBalance,
  });
};
