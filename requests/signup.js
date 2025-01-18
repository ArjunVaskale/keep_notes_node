let exportFunction = async (req, res, Users, bcrypt, jwt) => {
  try {
    console.log("signup body", req.body.email);

    const { username, email, password } = req.body;
    if (!username) {
      return res.send({ message: "username is not valid!" });
    }
    if (!email) {
      return res.send({ message: "email is not valid!" });
    }
    if (!password) {
      return res.send({ message: "password is not valid!" });
    }

    const oldUser = await Users.findOne({ email: email });
    if (oldUser) {
      return res.send({
        message: "email already exists.please try with another email.",
      });
    }

    let newUser = await Users.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
    });

    const token = jwt.sign(
      { user_id: newUser._id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const newUserResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: token,
    };

    newUserResponse["token"] = token;
    res.send(newUserResponse);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = exportFunction;
