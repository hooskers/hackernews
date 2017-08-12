import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import App, { Search, Button, Table } from './App';

describe('App', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <App />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Search', () => {

    const props = {
        onChange: () => {},
        onSubmit: () => {},
    }

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search {...props}>Search</Search>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Search {...props}>Search</Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Button', () => {

    const props = {
        onClick: () => {},
    }

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button {...props}>Button</Button>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Button {...props}>Button</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Table', () => {

  const props = {
    list: [
      {objectID: 'a', author: 'Shelob', url: 'www.google.com', num_comments: 4},
      {objectID: 'b', author: 'Wade', url: 'www.yahoo.com', num_comments: 5},
    ],
    onDismiss: () => {},
  };

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div);
  });

  it('shows two items in list', () => {
    const element = shallow(
      <Table {...props} />
    );

    expect(element.find('.table-row').length).toBe(2);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Table {...props} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});