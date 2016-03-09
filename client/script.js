class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      table: 'topRecent',
      ascending: true,
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
      if (this.state.ascending) {
        return this.state.topRecent;
      } else {
        let reverse = this.state.topRecent.slice().reverse();
        return reverse;
      }

    } else {
      if (this.state.ascending) {
        return this.state.topAllTime;
      } else {
        let reverse = this.state.topAllTime.slice().reverse();
        return reverse;
      }
    }
  }

  evaluateSortArrow(table) {
    if (this.state.table === table) {
      if (this.state.ascending) {
        return <span className="glyphicon glyphicon-triangle-top" onClick={this.toggleSort.bind(this)}></span>;
      } else {
        return <span className="glyphicon glyphicon-triangle-bottom" onClick={this.toggleSort.bind(this)}></span>;
      }
    }
  }

  toggleSort() {
    let sort = this.state.ascending;
    this.setState({ ascending: !sort });
  }

  setTable(e) {
    let table = e.target.dataset.table;
    this.setState({
      table: table,
      ascending: true
    });
  }

  render() {
    return (
      <div className="wrapper">
          <table className="table table-hover table-sm">
            <thead>
              <tr >
                <th>Camper</th>
                <th className="text-center">
                  <a href="#" onClick={this.setTable.bind(this)} data-table="topAllTime">Total Points</a>
                  {this.evaluateSortArrow('topAllTime')}
                </th>
                <th className="text-center">
                  <a href="#" onClick={this.setTable.bind(this)} data-table="topRecent">Recent Points (last 30 days)</a>
                  {this.evaluateSortArrow('topRecent')}
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
