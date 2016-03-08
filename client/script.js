class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
    // Get top recent
    this.getData('http://fcctop100.herokuapp.com/api/fccusers/top/recent')
      .then( (data) => { this.setState({ topRecent: data}); },
             (error) => { console.error(error); });

    // Get top all top app time
    this.getData('http://fcctop100.herokuapp.com/api/fccusers/top/alltime')
      .then( (data) => { this.setState({ topAllTime: data}); },
             (error) => { console.error(error); });
  }

  render() {
    return (
      <div className="wrapper">
        <TopRecentTable data={this.state.topRecent} />
      </div>
    )
  }
}

class TopRecentTable extends React.Component {
  render() {
    return(
      <ul>
        {this.props.data.map( (item, index) => {
          return <li key={index}>{index}</li>;
        })}
      </ul>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
