import { Router } from "express";
import { verify } from "jsonwebtoken";
import { generateToken, getCleanUser } from "../utils/utils";
import { logger } from "../logger";
const router = Router();

import {
  getUsers,
  login,
  addUser,
  deleteUser,
  updateUser,
  getUserById,
} from "../controller/userinfo";

router.get("/userinfo", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/userinfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    res.json(user);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/logininfo", async (req, res) => {
  const { password } = req.body;
  try {
    const newUser = await login(req.body);
    logger.info(newUser);
    logger.info(password);
    if (newUser.password === password) {
      const token = generateToken(newUser);
      const userObj = getCleanUser(newUser);
      const usr = {
        id: userObj?.id,
        fullName: userObj?.fullName,
        rolePosition: userObj?.rolePosition,
      };
      return res.json({ Item: usr, token });
    } else {
      logger.warn("Invalid credentials found");
      res.status(401).json({ err: "Invalid credentials found" });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/userinfo", async (req, res) => {
  const { id, fullName, password, rolePosition } = req.body;

  const data = {
    id: id,
    fullName: fullName,
    password: password,
    rolePosition: rolePosition,
  };
  try {
    const newUser = await addUser(data);
    res.json(newUser);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: err });
  }
});

//==================================================================

router.post("/tokeninfo", async (req, res) => {
  const { token } = req.body;

  var decodedClaims: any = verify(token, process.env.JWT_SECRET || "");
  const { id, password } = decodedClaims;
  try {
    const newUser: any = await login(decodedClaims);
    if (newUser.password === password) {
      const userObj = getCleanUser(newUser);
      const usr = {
        id: userObj?.id,
        fullName: userObj?.fullName,
        rolePosition: userObj?.rolePosition,
      };
      return res.json({ Item: usr });
    } else {
      logger.warn("Invalid credentials found");
      res.status(500).json({ err: "Invalid credentials found" });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

//==================================================================

router.put("/userinfo/:id", async (req, res) => {
  const user = req.body;
  const { id } = req.params;

  user.id = id;
  try {
    const editUser = await updateUser(user);
    res.json(editUser);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/userinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await deleteUser(id));
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

export default router;
