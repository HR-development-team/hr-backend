import { Router } from "express";
import {
  createUsers,
  destroyUsers,
  fetchAllUsers,
  fetchUserOptions,
  fetchUsersById,
  updateUsers,
} from "./user.controller.js";
import { authMiddleware } from "@common/middleware/authMiddleware.js";
import { FEATURES, PERMISSIONS } from "@common/constants/general.js";
import { checkPermission } from "@common/middleware/permissionMiddleware.js";

const router = Router();
router.use(authMiddleware);

const USER_FEATURE = FEATURES.USER_MANAGEMENT;

// get all users
router.get("/", checkPermission(USER_FEATURE, PERMISSIONS.READ), fetchAllUsers);

// get all users options
router.get(
  "/options",
  checkPermission(USER_FEATURE, PERMISSIONS.READ),
  fetchUserOptions
);

// get by id
router.get(
  "/:id",
  checkPermission(USER_FEATURE, PERMISSIONS.READ),
  fetchUsersById
);

// post users
router.post(
  "/",
  checkPermission(USER_FEATURE, PERMISSIONS.CREATE),
  createUsers
);

// put users by id
router.put(
  "/:id",
  checkPermission(USER_FEATURE, PERMISSIONS.UPDATE),
  updateUsers
);

// delete users by id
router.delete(
  "/:id",
  checkPermission(USER_FEATURE, PERMISSIONS.DELETE),
  destroyUsers
);

export default router;
