const User = require("../user");

const saveScore = (req, res) => {
  const { userName, score, date } = req.body;

  User.findOneAndUpdate(
    { userName: userName },
    { $push: { history: { score, date } } },
    async (err, doc) => {
      if (err) {
        throw err;
      }
      if (doc) {
        console.log(`Favorites of ${userName} were successfully updated`);
        res.send('Success');
      } else {
        const newUser = new User({
          userName,
          history: [{ score, date }],
        });
        await newUser.save();
      }
    });
};

const getUsers = (_, res) => {
  User.find({},
    async (err, docs) => {
      if (err) {
        throw err;
      }
      if (docs) {
        res.send(docs);
      }
    });
};

module.exports = {
  saveScore,
  getUsers,
};
