import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

const TOKEN = process.env.DISCORD_BOT_TOKEN ?? "";
const GUILD_ID = process.env.DISCORD_GUILD_ID ?? "";

const rest = new REST({ version: "10" }).setToken(TOKEN);

export const assignRoleToUser = async (userId: string, roleId: string) => {
  try {
    // check if user exists
    // https://discord.com/developers/docs/resources/guild#get-guild-member
    const member = await rest
      .get(Routes.guildMember(GUILD_ID, userId))
      .catch(() => null);
    if (!member) {
      console.log("User not found");
      return;
    }

    // check if role exists
    // https://discord.com/developers/docs/resources/guild#get-guild-roles
    const roles = await rest.get(Routes.guildRoles(GUILD_ID));
    const roleExists = (roles as any[]).some((role) => role.id === roleId);
    if (!roleExists) {
      console.log("Role not found");
      return;
    }

    // grant role to user
    // https://discord.com/developers/docs/resources/guild#add-guild-member-role
    await rest.put(Routes.guildMemberRole(GUILD_ID, userId, roleId));
    console.log(`Role ${roleId} has been assigned to user ${userId}`);
  } catch (error) {
    console.error("Error in assigning role:", error);
  }
};

export const revokeRoleFromUser = async (userId: string, roleId: string) => {
  try {
    // check if user exists
    // https://discord.com/developers/docs/resources/guild#get-guild-member
    const member = await rest
      .get(Routes.guildMember(GUILD_ID, userId))
      .catch(() => null);
    if (!member) {
      console.log("User not found");
      return;
    }

    // check if role exists
    // https://discord.com/developers/docs/resources/guild#get-guild-roles
    const roles = await rest.get(Routes.guildRoles(GUILD_ID));
    const roleExists = (roles as any[]).some((role) => role.id === roleId);
    if (!roleExists) {
      console.log("Role not found");
      return;
    }

    // revoke role from user
    // https://discord.com/developers/docs/resources/guild#remove-guild-member-role
    await rest.delete(Routes.guildMemberRole(GUILD_ID, userId, roleId));
    console.log(`Role ${roleId} has been revoked from user ${userId}`);
  } catch (error) {
    console.error("Error in revoking role:", error);
  }
};
