"use server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

const generatePassword = async password => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const checkEmailExists = async email => {
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (error && error.message !== "No rows found") {
    console.log(error.message);
    return null;
  }

  return !!data;
};

export const createUser = async user => {
  const emailExists = await checkEmailExists(user.email);
  if (emailExists) {
    console.log("Email already exists");
    return { error: "Email already exists" };
  }

  const password = await generatePassword(user.password);
  const { data, error } = await supabase
    .from("users")
    .insert({ name: user.name, password, email: user.email })
    .select()
    .single();

  if (error) {
    console.log(error.message);
    return { error: error.message };
  }

  const { error: error2 } = await supabase.from("users_roles").insert({
    user_id: data.id,
    role_id: user.role_id
  });

  if (error2) {
    console.log(error2.message);
    return { error: error2.message };
  }

  return { success: true };
};

export const createUserAndSelect = async user => {
  const emailExists = await checkEmailExists(user.email);
  if (emailExists) {
    console.log("Email already exists");
    return { error: "Email already exists" };
  }

  user.password = await generatePassword(user.password);
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) {
    console.log(error.message);
    return { error: error.message };
  }

  return data;
};

export const getUsers = async () => {
  const query = supabase
    .from("users")
    .select("*, users_roles(*, role_id(*))")
    .order("created_at", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.log(error.message);
    return null;
  }

  return data;
};

export const getUserData = async userId => {
  const { data, error } = await supabase
    .from("users")
    .select("*, users_roles(*, role_id(*))")
    .eq("id", userId)
    .single();

  if (error) {
    console.log(error.message);
    return null;
  }

  return data;
};

export const updateUser = async (
  userId,
  user,
  editPassword = false,
  editRole = false
) => {
  let updatedUser = {
    name: user.name,
    email: user.email
  };

  if (editPassword) {
    updatedUser.password = await generatePassword(user.password);
  }

  if (editRole) {
    await updateUserRole(userId, user.role_id);
  }

  const { error } = await supabase
    .from("users")
    .update(updatedUser)
    .eq("id", userId);

  if (error) {
    console.log(error.message);
    return null;
  }

  return true;
};

export const updateUserRole = async (userId, roleId) => {
  const { error } = await supabase
    .from("users_roles")
    .update({ role_id: roleId })
    .eq("user_id", userId);

  if (error) {
    console.log(error.message);
    return null;
  }

  return true;
};

export const updatePassword = async (userId, password) => {
  const { error } = await supabase
    .from("users")
    .update({ password })
    .eq("id", userId);

  if (error) {
    console.log(error.message);
    return null;
  }

  return true;
};

export const deleteUser = async userId => {
  await deleteUserRole(userId);
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    console.log(error.message);
    return null;
  }

  return true;
};

const deleteUserRole = async userId => {
  const { error } = await supabase
    .from("users_roles")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.log(error.message);
    return null;
  }

  return true;
};
