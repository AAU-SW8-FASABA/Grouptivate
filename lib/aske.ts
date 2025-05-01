import { Group } from "./API/schemas/Group";
import { User } from "./API/schemas/User";

const asker = [
  require("@/assets/images/aske/1.jpg"),
  require("@/assets/images/aske/2.jpg"),
  require("@/assets/images/aske/3.jpg"),
  require("@/assets/images/aske/4.jpg"),
  require("@/assets/images/aske/5.jpg"),
  require("@/assets/images/aske/6.jpg"),
  require("@/assets/images/aske/7.jpg"),
  require("@/assets/images/aske/8.jpg"),
  require("@/assets/images/aske/9.jpg"),
  require("@/assets/images/aske/10.jpg"),
  require("@/assets/images/aske/11.jpg"),
  require("@/assets/images/aske/12.jpg"),
  require("@/assets/images/aske/13.jpg"),
  require("@/assets/images/aske/14.jpg"),
  require("@/assets/images/aske/15.jpg"),
  require("@/assets/images/aske/16.jpg"),
  require("@/assets/images/aske/17.jpg"),
  require("@/assets/images/aske/18.jpg"),
  require("@/assets/images/aske/19.jpg"),
  require("@/assets/images/aske/20.jpg"),
  require("@/assets/images/aske/21.jpg"),
  require("@/assets/images/aske/22.jpg"),
  require("@/assets/images/aske/23.jpg"),
  require("@/assets/images/aske/24.jpg"),
  require("@/assets/images/aske/25.jpg"),
  require("@/assets/images/aske/26.jpg"),
  require("@/assets/images/aske/27.jpg"),
  require("@/assets/images/aske/28.jpg"),
  require("@/assets/images/aske/29.jpg"),
  require("@/assets/images/aske/30.jpg"),
  require("@/assets/images/aske/31.jpg"),
  require("@/assets/images/aske/32.jpg"),
  require("@/assets/images/aske/33.jpg"),
  require("@/assets/images/aske/34.jpg"),
  require("@/assets/images/aske/35.jpg"),
  require("@/assets/images/aske/36.jpg"),
  require("@/assets/images/aske/37.jpg"),
  require("@/assets/images/aske/38.jpg"),
  require("@/assets/images/aske/39.jpg"),
  require("@/assets/images/aske/40.jpg"),
  require("@/assets/images/aske/41.jpg"),
  require("@/assets/images/aske/42.jpg"),
  require("@/assets/images/aske/43.jpg"),
  require("@/assets/images/aske/44.jpg"),
];

export const defaultAske = asker[0];

/**
 * Returns the most appropriate aske image to match the user og group.
 */
export function getAske(
  entity:
    | Pick<Group, "groupId" | "groupName" | "users">
    | Pick<User, "userId" | "name">,
): any {
  let key: string;
  if ("groupId" in entity) {
    key = entity.groupId + entity.groupName;
    for (const [id, name] of Object.entries(entity.users)) {
      key += id + name;
    }
  } else {
    key = entity.userId + entity.name;
  }

  let askeNumber = 0;
  for (let i = 0; i < key.length; i++) {
    askeNumber += key.charCodeAt(i);
  }
  askeNumber %= asker.length;

  return asker[askeNumber];
}
