import React from 'react';

const StateContext = React.createContext({
  state: {},
  dispatch: () => undefined
});

const withDefault = (mapTo) => ((a, b) => mapTo ? mapTo(a, b) : {});

export const Provider = ({ reducer, defaultState, children, useReducer = React.useReducer }) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  )
};

export const connect = (mapStateToProps, mapDispatchToProps) => {
  return (WrappedComp) => {
    return class extends React.Component {
      static navigationOptions = WrappedComp.navigationOptions
      render() {
        return (
          <StateContext.Consumer>
            {
              ({ state, dispatch }) => <WrappedComp dispatch={dispatch} {...this.props} {...withDefault(mapStateToProps)(state, this.props)} {...withDefault(mapDispatchToProps)(dispatch, this.props)} />
            }
          </StateContext.Consumer >
        )
      }
    }
  }
}
