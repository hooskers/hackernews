import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
//import Table from './Table/Table';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE  = 0;
const DEFAULT_HPP   = '100';

const PATH_BASE     = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH   = '/search';
const PARAM_SEARCH  = 'query=';
const PARAM_PAGE    = 'page=';
const PARAM_HPP     = 'hitsPerPage=';
const URL           = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;

const Loading = () =>
  <div>Loading...</div>

class Search extends Component {

  componentDidMount() {
    this.input.focus();
  }

  render() {
    const {
      value,
      onChange,
      children,
      onSubmit,
    } = this.props;

    return(
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => { this.input = node; }}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

Search.propTypes = {
  value:    PropTypes.string,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

const Button = ({ onClick, className, children }) =>
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>

Button.propTypes = {
  onClick:    PropTypes.func.isRequired,
  className:  PropTypes.string.isRequired,
  children:   PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: '',
}

const Table = ({ list, onDismiss }) =>
  <div className="table">
    { list.map(item =>
      <div className="table-row" key={item.objectID}>
        <span style={{width: '40%'}}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{width: '30%'}}>{item.author}</span>
        <span style={{width: '10%'}}>{item.num_components}</span>
        <span style={{width: '10%'}}>{item.points}</span>
        <span style={{width: '10%'}}>
          <Button
            className="button-inline"
            onClick={() => onDismiss(item.objectID)} >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID:     PropTypes.string.isRequired,
      author:       PropTypes.string,
      url:          PropTypes.string,
      num_comments: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories     = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories   = this.fetchSearchTopstories.bind(this);
    this.onDismiss               = this.onDismiss.bind(this);
    this.onSearchChange          = this.onSearchChange.bind(this);
    this.onSearchSubmit          = this.onSearchSubmit.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false,
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    this.setState( {isLoading: true} );

    fetch(`${URL}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  onSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    e.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  render() {
    const {
      searchTerm, 
      results, 
      searchKey,
      isLoading, 
    } = this.state;

    const page = (results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          { isLoading
            ? <Loading />
            : <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
              More
            </Button>
          }
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

export default App;

export {
  Button,
  Search,
  Table,
}