import { Client, Databases, IndexType } from 'node-appwrite';

const DATABASE_ID = "main";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT.replace("http://", "https://"))
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const databases = new Databases(client);

  const col = await createOrUpdateCollection(log, databases, "test", "Test", [], true);
  await initTest(log, databases, col);

  return res.text('done');
};

async function initTest(log, databases, col) {
  await createOrUpdateAttributeString(log, databases, col.$id, "aaaaaaaaa", 32, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "bbbbbbbbb", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "ccccccccccc", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "ddddddddddddd", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "eeeeeeeeeee", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "ffffffffffff", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "gggggggg", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "hhhhhhh", 128, false);
  await createOrUpdateAttributeString(log, databases, col.$id, "iiiiiiiii", 128, false);

  //await new Promise(resolve => setTimeout(resolve, 2000));
  await createIndex(log, databases, col.$id, "test_index1", IndexType.Key, ["bbbbbbbbb", "iiiiiiiii"], ["DESC"]);
  await createIndex(log, databases, col.$id, "test_index1", IndexType.Key, ["ddddddddddddd"], ["DESC"]);
  await createIndex(log, databases, col.$id, "test_index1", IndexType.Key, ["gggggggg"], ["DESC"]);
  await createIndex(log, databases, col.$id, "test_index1", IndexType.Key, ["iiiiiiiii"], ["DESC"]);
  log('-');
}

async function createOrUpdateAttributeString(log, databases, collectionId, key, size, required, default_ = null, isArray = false, encrypt = false) {
  log("init string attribute '" + key + "' on '" + collectionId + "'");
  const result = await databases.createStringAttribute(
    DATABASE_ID,
    collectionId,
    key,
    size,
    required,
    default_, // optional
    isArray, // optional
    encrypt // optional
  ).catch(err => { if (!err.message?.startsWith("Attribute with the requested key already exists")) { log("catched create error " + err) } });
  if (result == null) {
    await databases.updateStringAttribute(
      DATABASE_ID,
      collectionId,
      key,
      required,
      default_, // optional
      size,
      //'' // newKey (optional)
    );
  }
}

async function createOrUpdateCollection(log, databases, collectionId, name, permissions, documentSecurity, enabled = true) {
  log("init '" + name + "' collection");
  let col = await databases.getCollection(
    DATABASE_ID,
    collectionId
  ).catch(err => { });
  if (col == null) {
    col = await databases.createCollection(
      DATABASE_ID,
      collectionId,
      name,
      permissions, // optional
      documentSecurity, // optional
      enabled // optional
    );
  } else {
    col = await databases.updateCollection(
      DATABASE_ID,
      collectionId,
      name,
      permissions, // optional
      documentSecurity, // optional
      enabled // optional
    );
  }
  return col;
}

async function createIndex(log, databases, collectionId, key, type, attributes, orders = ["ASC"]) {
  log("init index '" + key + "' on '" + collectionId + "'");
  let index = await databases.getIndex(
    DATABASE_ID,
    collectionId,
    key
  ).catch(err => { });
  if (index == null) {
    index = await databases.createIndex(
      DATABASE_ID,
      collectionId,
      key,
      type,
      attributes,
      orders // optional
    );
  }
  return index;
}