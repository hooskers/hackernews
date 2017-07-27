import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../App'

//TODO: How to get the props that are passed in
class Table extends Component {
  render() {
    const { list, onDismiss } = this.props;
    return (
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
    )
  }
}

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

export {Table};