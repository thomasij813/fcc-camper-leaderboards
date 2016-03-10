const STORE = {
  topRecent: {},
  topAllTime: {}
};

function getData(url) {
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let responseData = JSON.parse(request.responseText)
          // Add rank to data
          .map(function(user, index) {
            user.rank = index + 1;
            return user;
          });
        resolve(responseData);
      } else {
        reject('There was an error');
      }
    };

    request.send();
  });
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      table: '',
      data: [],
      ascending: true
    };
  }

  componentDidMount() {
    let dataRequests = [
      getData('http://fcctop100.herokuapp.com/api/fccusers/top/recent'),
      getData('http://fcctop100.herokuapp.com/api/fccusers/top/alltime')
    ];
    Promise.all(dataRequests).then(function(responses) {
      STORE.topRecent = {
        data: responses[0],
        table: 'Recent'
      };
      STORE.topAllTime = {
        data: responses[1],
        table: 'All Time'
      };
      this.setState({
        loading: false,
        table: STORE.topRecent.table,
        data: STORE.topRecent.data
      });
    }.bind(this));
  }

  onTableSelect(tableObj) {
    this.setState({
      table: tableObj.table,
      data: tableObj.data
    });
  }

  onSort(sortValue) {
    let sortedData;
    if (sortValue === 'rank') {
      sortedData = this.state.data.sort(function(a, b) {
        return a[sortValue] - b[sortValue];
      });
    } else if (sortValue === 'username') {
      sortedData = this.state.data.sort(function(a, b){
          if(a[sortValue].toLowerCase() < b[sortValue].toLowerCase()) return -1;
          if(a[sortValue].toLowerCase() > b[sortValue].toLowerCase()) return 1;
          return 0;
      });
    } else {
      sortedData = this.state.data.sort(function(a, b) {
        return b[sortValue] - a[sortValue];
      });
    }
    this.setState({ data: sortedData})
  }

  render() {
    if (this.state.loading) {
      return <div>Loading</div>;
    } else {
      return (
        <div className="container">
          <h1 className="text-center">Free Code Camp Camper Leaderboards</h1>
          <TableSelectorButtonGroup onTableSelect={this.onTableSelect.bind(this)} currentTable={this.state.table}/>
          <table className="table table-hover table-sm">
            <thead>
              <tr >
                <ColumnHeader classNameProp="" headerTitle="Rank" handleSort={this.onSort.bind(this)} sortValue="rank"/>
                <ColumnHeader classNameProp="" headerTitle="Camper" handleSort={this.onSort.bind(this)} sortValue="username"/>
                <ColumnHeader classNameProp="text-center" headerTitle="Total Points" handleSort={this.onSort.bind(this)} sortValue="alltime"/>
                <ColumnHeader classNameProp="text-center" headerTitle="Recent Points (last 30 days)" handleSort={this.onSort.bind(this)} sortValue="recent"/>
              </tr>
            </thead>
            <TableBody data={this.state.data} />
          </table>
        </div>
      )
    }
  }
}

class ColumnHeader extends React.Component {
  handleSort() {
    this.props.handleSort(this.props.sortValue);
  }
  render() {
    return(
      <th className={this.props.classNameProp}>
        <a href="#" onClick={this.handleSort.bind(this)}>{this.props.headerTitle}</a>
      </th>
    );
  }
}

class TableSelectorButtonGroup extends React.Component {
  render() {
    return(
      <div className="btn-group btn-group-justified" role="group">
        <TableSelectorButton
          handleTableSelect={this.props.onTableSelect}
          tableObj={STORE.topAllTime}
          currentTable={this.props.currentTable}
        />
        <TableSelectorButton
          handleTableSelect={this.props.onTableSelect}
          tableObj={STORE.topRecent}
          currentTable={this.props.currentTable}
        />
      </div>
    );
  }
}

class TableSelectorButton extends React.Component {
  handleClick() {
    this.props.handleTableSelect(this.props.tableObj);
  }
  evaluateClassName() {
    if (this.props.tableObj.table === this.props.currentTable) {
      return 'btn btn-primary';
    } else {
      return 'btn btn-default';
    }
  }
  render() {
    return (
      <a
        type="button"
        onClick={this.handleClick.bind(this)}
        className={this.evaluateClassName()}
      >
         {this.props.tableObj.table}
      </a>
    );
  }
}

class TableBody extends React.Component {
  render() {
    return(
      <tbody>
        {this.props.data.map( (item, index) => {
          return (
            <tr key={index}>
              <td>{item.rank}</td>
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
