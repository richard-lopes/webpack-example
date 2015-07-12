import flux from 'control';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'actions/dummyActions';

@createStore(flux)
class DummyStore {
  name = 'awesome';

  @bind(actions.updateName)
  updateName(name) {
    this.name = name;
  }
}

export default DummyStore;
