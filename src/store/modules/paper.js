import PaperService from '@/api/paper'

const paper = {
  namespaced: true,
  state: () => ({
    items: [],
    selected: [],
    loading: false,
    current: 0,
    total: 0,
    paper: {},
    baseUrl: 'https://sci-hub.tw/',
    searchOptions: {
      limit: 10,
      offset: 0,
      q: '',
      isChecked: '',
      filterName: ''
    }
  }),
  getters: {
    isPaperSelected(state) {
      return state.selected.length > 0
    },
    approved(state) {
      if (state.items[state.current]) {
        return state.items[state.current].status !== 'Submitted'
      } else {
        return false
      }
    },
    currentPaper(state) {
      return state.paper
    }
  },
  mutations: {
    setCurrent(state, payload) {
      state.current = payload
    },
    setPaper(state, payload) {
      state.paper = payload
    },
    setPaperList(state, payload) {
      state.items = payload
    },
    addPaper(state, paper) {
      state.items.unshift(paper)
    },
    deletePaper(state, paperId) {
      state.items = state.items.filter(item => item.pmid !== paperId)
    },
    updateSelected(state, selected) {
      state.selected = selected
    },
    updatePaper(state, paper) {
      const item = state.items.find(item => item.pmid === paper.pmid)
      Object.assign(item, paper)
    },
    resetSelected(state) {
      state.selected = []
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setTotalItems(state, payload) {
      state.total = payload
    },
    updateSearchOptions(state, payload) {
      state.searchOptions = Object.assign(state.searchOptions, payload)
    },
    initSearchOptions(state) {
      state.searchOptions = {
        limit: 10,
        offset: 0,
        q: '',
        isChecked: '',
        filterName: ''
      }
    }
  },
  actions: {
    getPaperList({ commit, state }, payload) {
      commit('setLoading', true)
      payload = Object.assign(payload, state.searchOptions)
      return new Promise((resolve, reject) => {
        PaperService.getPaperList(payload)
          .then(response => {
            commit('setPaperList', response.results)
            commit('setTotalItems', response.count)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {
            commit('setLoading', false)
          })
      })
    },
    setCurrentPaper({ commit }, paperId) {
      return new Promise((resolve, reject) => {
        PaperService.fetchPaperById(paperId)
          .then(response => {
            commit('setPaper', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updatePaper({ commit }, data) {
      return new Promise((resolve, reject) => {
        PaperService.updatePaper(data.id, data)
          .then(response => {
            commit('updatePaper', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deletePaper({ commit, state }) {
      return new Promise((resolve, reject) => {
        for (const paper of state.selected) {
          PaperService.deletePaper(paper.pmid)
            .then(() => {
              commit('deletePaper', paper.pmid)
            })
            .catch(error => {
              reject(error)
            })
        }
        commit('resetSelected')
      })
    },
    approve({ commit, getters }) {
      const paperId = getters.currentPaper.pmid
      var status = getters.currentPaper.status
      if (status === 'Submitted') {
        status = 'Checked'
      }
      const data = {
        status: status
      }
      return new Promise((resolve, reject) => {
        PaperService.approvePaper(paperId, data)
          .then(response => {
            commit('updatePaper', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default paper
