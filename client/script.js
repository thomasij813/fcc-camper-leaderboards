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

  evaluateData() {
    if (this.state.table === 'topRecent') {
      return this.state.topRecent;
    } else {
      return this.state.topAllTime;
    }
  }

  setTable(e) {
    let table = e.target.dataset.table;
    this.setState({ table: table });
  }

  render() {
    return (
      <div className="wrapper">
          <table className="table table-hover table-sm">
            <thead>
              <tr >
                <th>#</th>
                <th>Camper</th>
                <th className="text-center">
                  <a href="#" onClick={this.setTable.bind(this)} data-table="topAllTime">Total Points</a>
                </th>
                <th className="text-center">
                  <a href="#" onClick={this.setTable.bind(this)} data-table="topRecent">Recent Points (last 30 days)</a>
                </th>
              </tr>
            </thead>
            <TableBody data={this.evaluateData()} />
          </table>
      </div>
    )
  }
}

class TableBody extends React.Component {
  render() {
    return(
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
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
