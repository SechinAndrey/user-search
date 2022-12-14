import { useAxios } from "@vueuse/integrations/useAxios";
import { searchUrl } from "@/api/userApiUrls";

export default {
  state: () => ({
    searchQuery: "",
    usersList: [],
    limit: 10,
    canLoadMore: true,
  }),
  mutations: {
    setUsersList(state, usersList) {
      state.usersList = state.usersList.concat(usersList);
    },
    clear(state) {
      state.usersList = [];
      state.searchUrl = "";
      state.canLoadMore = true;
    },
    setSearchQuery(state, searchQuery) {
      state.searchQuery = searchQuery;
    },
    setCanLoadMore(state, canLoadMore) {
      state.canLoadMore = canLoadMore;
    },
  },
  actions: {
    async fetchUsers({ commit, getters, state }, searchQuery) {
      if (searchQuery !== getters.searchQuery) {
        commit("clear");
        commit("setSearchQuery", searchQuery);
      }
      const { data } = await useAxios(
        `${searchUrl}/${searchQuery}?limit=10&name_gt=${getters.lastUserName}`
      );
      commit("setUsersList", data.value.data);
      commit("setCanLoadMore", data.value?.data?.length === state.limit);
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
    canLoadMore: (state) => state.canLoadMore,
  },
};
