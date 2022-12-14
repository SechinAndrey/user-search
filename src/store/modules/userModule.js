import { useAxios } from "@vueuse/integrations/useAxios";
import { searchUrl } from "@/api/userApiUrls";

export default {
  state: () => ({
    searchQuery: "",
    usersList: [],
    limit: 10,
  }),
  mutations: {
    setUsersList(state, usersList) {
      state.usersList = state.usersList.concat(usersList);
    },
    clear(state) {
      state.usersList = [];
      state.searchUrl = "";
    },
    setSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery;
    },
  },
  actions: {
    async fetchUsers({ commit, getters }, searchQuery) {
      if (searchQuery !== getters.searchQuery) {
        commit("clear");
        commit("setSearchQuery", searchQuery);
      }
      const { data } = await useAxios(
        `${searchUrl}/${searchQuery}?limit=10&name_gt=${getters.lastUserName}`
      );
      commit("setUsersList", data.value.data);
      console.log(data);
    },
  },
  getters: {
    usersList: (state) => state.usersList,
    lastUserName: (state) =>
      state.usersList.length > 0
        ? state.usersList[state.usersList.length - 1].name
        : "",
    searchQuery: (state) => state.searchQuery,
  },
};
