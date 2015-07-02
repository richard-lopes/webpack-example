import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import changeHandler from 'utils/changeHandler';
import DummyStore from 'stores/dummyStore';
import DummyActions from 'actions/dummyActions';

@connectToStores
@changeHandler
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    }
  }

  static getStores(props) {
    return [DummyStore];
  }

  static getPropsFromStores(props) {
    return DummyStore.getState();
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={evt => this.onChange('name', evt, DummyActions.updateName)}/>
        <h1>It works: {this.props.name}</h1>
      </div>
    );
  }
}

export default Example;
