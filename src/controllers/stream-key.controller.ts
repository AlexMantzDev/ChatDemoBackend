import crypto from "crypto";
import { Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { User } from "../models/index";
import IGetUserAuthInfoRequest from "../interfaces/IGetUserAuthInfoRequest";

export const createStreamKey = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const id = req.user?.id;
  if (!id) {
    res.status(400).json({ message: "user id is missing from request." });
  }
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "could not find user with id: ", id });
      return;
    }
    const streamKey = generateStreamKey();
    const hashedStreamKey = await bcrypt.hash(streamKey, 10);
    await User.update({ streamKey: hashedStreamKey }, { where: { id } });
    res
      .status(200)
      .json({ message: "stream key created successfully. ", streamKey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to create stream key" });
  }
};

export const replaceStreamKey = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { id } = req.user!;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `Could not find user with id: ${id}` });
      return;
    }

    const streamKey = generateStreamKey();
    const hashedStreamKey = await bcrypt.hash(streamKey, 10);
    await User.update({ streamKey: hashedStreamKey }, { where: { id } });

    res
      .status(200)
      .json({ message: "Stream key replaced successfully", streamKey });
  } catch (error) {
    console.error("Error replacing stream key:", error);
    res.status(500).json({ message: "Failed to replace stream key", error });
  }
};

export const verifyStreamKey = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { streamKey } = req.body;
  const id = req.user?.id;
  if (!id || !streamKey) {
    res.status(400).json({ message: "User ID and stream key are required" });
    return;
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `Could not find user with ID: ${id}` });
      return;
    }

    if (!user.streamKey) {
      res.status(400).json({ message: "No stream key found for the user" });
      return;
    }

    const isMatch = await bcrypt.compare(streamKey, user.streamKey);
    if (isMatch) {
      res.status(200).json({ message: "Stream key is valid" });
    } else {
      res.status(401).json({ message: "Invalid stream key" });
    }
  } catch (error) {
    console.error("Error verifying stream key:", error);
    res.status(500).json({ message: "Failed to verify stream key" });
  }
};

const generateStreamKey = (): string => {
  const randomBytes = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now().toString(36);
  const uniqueId = uuidv4().replace(/-/g, "");

  const streamKey = `${randomBytes}-${timestamp}-${uniqueId}`;
  return streamKey;
};
