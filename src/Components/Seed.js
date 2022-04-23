import React from 'react';

export class Seed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {seed: 0};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({seed: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.seed);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Seed:
          <input 
            type="number" 
            seed={this.state.seed} 
            onChange={this.handleChange} 
            placeholder="Enter Seed"
          />
        </label>
      </form>
    );
  }
}