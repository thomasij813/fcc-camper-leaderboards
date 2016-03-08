function getData(url) {
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        let response = request.responseText;
        resolve(response);
      } else {
        reject('There was an error');
      }
    };

    request.send();
  });
}

getData('http://fcctop100.herokuapp.com/api/fccusers/top/recent')
  .then((response) => {
    console.log(response);
  }, (error) => {
    console.error(error);
  });

class App extends React.Component {

  render() {
    return (
      <div className="wrapper">
        test
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))
