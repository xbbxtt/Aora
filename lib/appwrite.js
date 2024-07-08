import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: "668c3b36001ab9294619",
    databaseId: "668c3de400384def8d0d",
    userCollectionId: "668c3e35001f16a10a1c",
    videoCollectionId: "668c3e6b0031b0b9624a",
    storageId: "668c4097002aca7c4351"
}

// Init your React Native SDK
const client = new Client()

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

// Create User
export const createUser =  async (email, password, username) => {
    try {
        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        )

        if (!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          ID.unique(),
          {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl,
          }
        )

        return newUser
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
}

// Sign In
export const signIn = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);

      return session;
    } catch (error) {
      throw new Error(error);
    }
  }
