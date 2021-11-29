import { memberChars } from "../../common/members";
import { jsonResponse } from "../utils/jsonResponse";

const SHUFFLE_KEY_PREFIX = `haropuro_shuffle:`;

const invalidInput = (input: string) =>
  input.split("").filter((char) => !memberChars.includes(char)).length > 0;

export const onRequestGet: PagesFunction<{
  HAROPURO_SHUFFLE: KVNamespace;
}> = async ({ env }) => {
  try {
    const kvList = await env.HAROPURO_SHUFFLE.list({
      prefix: SHUFFLE_KEY_PREFIX,
      limit: 1000,
    });

    if (!kvList.list_complete) {
      await Promise.all(
        kvList.keys.map(async (kvData) => {
          try {
            return await env.HAROPURO_SHUFFLE.delete(kvData.name);
          } catch {}
        })
      );
    }

    const memberNames = await Promise.all(
      kvList.keys.map(async (kvData) => {
        try {
          const name = await env.HAROPURO_SHUFFLE.get(kvData.name);
          return name;
        } catch {}
      })
    );
    return jsonResponse({
      memberNames: memberNames.reverse(),
      cursor: kvList.cursor,
    });
  } catch (e) {
    return jsonResponse({}, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<{
  HAROPURO_SHUFFLE: KVNamespace;
}> = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const output = url.searchParams.get("output") || "";
    const timestamp = new Date().getTime();
    if (output === "" || invalidInput(output)) {
      return jsonResponse({}, { status: 400 });
    }
    await env.HAROPURO_SHUFFLE.put(`${SHUFFLE_KEY_PREFIX}${timestamp}`, output);
    return jsonResponse({}, { status: 200 });
  } catch (e) {
    return jsonResponse({}, { status: 500 });
  }
};
