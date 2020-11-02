"use strict";
import * as util from "./util";
const version = "v1.0a";
class Square extends React.Component {
  render() {
    return (
      <div className="square">
        <input
          type="text"
          id={this.props.id}
          maxLength="2"
          value={this.props.value}
          //defaultValue={this.props.id}
          onChange={this.props.handleInput}
          readOnly
        />
      </div>
    );
  }
}

class Puzzle extends React.Component {
  showProperValue(c) {
    return c >= "1" && c <= "9" ? c : "";
  }
  render() {
    let squareItems = []; //list of square item
    for (var i = 0; i < 81; i++) {
      //pushing 81 square into the list
      squareItems.push(
        <Square
          value={this.showProperValue(this.props.sqaures[i])}
          key={i}
          id={i}
          //id={`${Math.floor(i/9)},${i%9}#${i}`}
          handleInput={this.props.handleSquareInput}
        />
      );
    }
    return <div id="puzzle">{squareItems}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var tmp = util.dummyPuzzleExample();
    /* under construction */
    this.possibleValuesOfIndexes = Array.from({ length: 81 }, () =>
      Array.from({ length: 9 }, (x, i) => i + 1)
    );
    this.possibleValuesOfIndexes.reset = function () {
      this.possibleValuesOfIndexes = Array.from({ length: 81 }, () =>
        Array.from({ length: 9 }, (x, i) => i + 1)
      );
    };
    /* under construction */

    this.state = {
      version: version,
      squares: Array(81).fill("0"),
      //squares: tmp,
      message: "",
    };
    this.handleSquareInput = this.handleSquareInput.bind(this);
    this.puzzleGenerator = this.puzzleGenerator.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.getValueByIndex = this.getValueByIndex.bind(this);
    this.setMessage = this.setMessage.bind(this);
  }
  setMessage(type, input) {
    var output;
    switch (type) {
      case "Validation":
        output = `Puzzle is ${input ? "Valid" : "NOT Valid"}`;
        break;
      case "Generation":
        output = `Time elapsed: ${input.toString()}ms`;
        break;
      default:
        output = "";
    }
    this.setState({ message: output });
  }
  checkValid() {
    console.log("checkValid()");
    const parameterContainer = ["row", "col", "grid"];
    const cRefs = {
      //corresponding references
      row: "col",
      col: "row",
      grid: "grid",
    };
    for (let argu of parameterContainer) {
      const cIndexes = indexGenerator(9, cRefs[argu]);
      for (let cIndex of cIndexes) {
        let indexes = indexGenerator(9, argu, cIndex);
        const values = this.getValueByIndex(indexes);
        if (hasRedundancy(values)) return false;
      }
    }
    return true;
  }

  getValueByIndex(indexes) {
    return Array.from(indexes, (x) => this.state.squares[x]);
  }

  puzzleGenerator() {
    var tBegin = performance.now();
    let out = Array(81); //output array initialization.
    let possibleValuesOfIndexes = Array.from({ length: 81 }, () =>
      Array.from({ length: 9 }, (x, i) => i + 1)
    );
    let randomPick = function (index) {
      let A = possibleValuesOfIndexes[index];
      if (A.length == 1) return A[0];
      let rIndex = Math.floor(Math.random() * A.length);
      return A[rIndex];
    };
    let cleanUpPossibleValue = function (index, pick) {
      //console.log(`cleanUp()\nindex=${index} pick=${pick}`)
      let row = indexGenerator(9, "row", index);
      let col = indexGenerator(9, "col", index);
      let grid = indexGenerator(9, "grid", index);
      let related = filterIndexes([row, col, grid], index);
      let l = related.length;
      //console.log(related);
      for (var i = 0; i < l; i++) {
        let PVarray = possibleValuesOfIndexes[related[i]];
        let targetValueIndex = PVarray.indexOf(pick);
        if (targetValueIndex == -1) continue;
        PVarray[targetValueIndex] = PVarray[PVarray.length - 1];
        PVarray.pop();
      }
    };
    let length = out.length;
    let again = true;
    let maxLoop = 5000;
    while (again && maxLoop--) {
      possibleValuesOfIndexes = Array.from({ length: 81 }, () =>
        Array.from({ length: 9 }, (x, i) => i + 1)
      );
      for (var i = 0; i < 81; i++) {
        let selectedValue = randomPick(i);
        if (selectedValue == undefined) break;
        cleanUpPossibleValue(i, selectedValue);
        out[i] = selectedValue;
        if (i == 80) again = false;
      }
    }

    out = out.map((x) => x.toString());
    this.setState({
      squares: out,
    });
    var tEnd = performance.now();
    return (tEnd - tBegin).toFixed(2);
  }
  handleSquareInput(evt) {
    console.log("setState begin");
    let input = evt.nativeEvent.data;
    let char = input >= "1" && input <= "9" ? input : "0";
    this.setState({
      squares: Array(81).fill(char),
    });
    console.log(this.state.squares);
  }
  render() {
    return (
      <div id="game">
        <Puzzle
          sqaures={this.state.squares}
          handleSquareInput={(evt) => this.handleSquareInput(evt)}
        />
        <div id="function">
          <div id="message">{this.state.message}</div>
          <input
            type="button"
            defaultValue="Check Correctness"
            onClick={() => this.setMessage("Validation", this.checkValid())}
          ></input>
          <input
            type="button"
            defaultValue="Generare Puzzle"
            onClick={() =>
              this.setMessage("Generation", this.puzzleGenerator())
            }
          ></input>
          <div id="version">{this.state.version}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
