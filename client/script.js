class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      table: 'topRecent',
      topRecent: [],
      topAllTime: []
    };
  }

  getData(url) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let response = request.responseText;
          resolve(JSON.parse(response));
        } else {
          reject('There was an error');
        }
      };

      request.send();
    });
  }

  componentDidMount() {
    this.getData('http://fcctop100.herokuapp.com/api/fccusers/top/recent')
      .then( (data) => { this.setState({ topRecent: data}); },
             (error) => { console.error(error); });

    this.getData('http://fcctop100.herokuapp.com/api/fccusers/top/alltime')
      .then( (data) => { this.setState({ topAllTime: data}); },
             (error) => { console.error(error); });
  }

  toggleTable() {
    if (this.state.table === 'topRecent') {
      this.setState({ table: 'topAllTime'});
    } else {
      this.setState({ table: 'topRecent'});
    }
  }

  render() {
    let table;
    if (this.state.table === "topRecent") {
      table = <Table
                data={this.state.topRecent}
                table="topRecent"
              />;
    } else {
      table = <Table
                data={this.state.topAllTime}
                table="topAllTime"
              />
    }
    return (
      <div className="wrapper">
        <button onClick={this.toggleTable.bind(this)}>{this.state.table}</button>
        {table}
      </div>
    )
  }
}

class Table extends React.Component {
  render() {
    return(
      <div>
        <p>{this.props.table}</p>
          <ul>
            {this.props.data.map( (item, index) => {
              return <li key={index}>{item.username}</li>;
            })}
          </ul>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
