import Store from "wxministore";
import { useUserState, useUserMethods } from "./user";

const store = new Store({
  state: {
    user: useUserState(),
    defaultImage:
      "https://img1.baidu.com/it/u=1887949856,1077602369&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=486",
  },
  methods: {
    ...useUserMethods(),
  },
});

module.exports = store;
