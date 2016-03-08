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

  evaluateData() {
    if (this.state.table === 'topRecent') {
      return this.state.topRecent;
    } else {
      return this.state.topAllTime;
    }
  }

  render() {
    return (
      <div className="wrapper">
        <button onClick={this.toggleTable.bind(this)}>{this.state.table}</button>
        <Table data={this.evaluateData()} table={this.state.table}/>
      </div>
    )
  }
}

class Table extends React.Component {
  render() {
    return(
      <table className="table table-hover table-sm">
        <thead>
          <tr >
            <th>#</th>
            <th>Camper</th>
            <th className="text-center">Total Points</th>
            <th className="text-center">Recent Points (last 30 days)</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map( (item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img src={item.img} className="user_image"/> <a href={`http://www.freecodecamp.com/${item.username}`}>{item.username}</a>
                  </td>
                <td className="text-center">{item.alltime}</td>
                <td className="text-center">{item.recent}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
