import {DealHand} from "./DealHand";

export class DealHandCondition {

  lowPoints = 0;
  highPoints = 30;

  condition = "";

  public eval: Function;

  constructor() {
    this.eval = (x: DealHand) => true;
  }

  check(hand: DealHandCondition): boolean {
    return this.eval(hand);
  }

  importAndParseCondition(cond: string): boolean {
    this.condition = cond;
    return this.parseCondition();
  }

  parseCondition(): boolean {
    this.condition = this.condition.trim();
    if (this.condition.length === 0) return true;
    try {
      let ff = this.parseConditionWorker(this.condition);
      if (ff) {
        this.eval = ff;
        return true;
      } else return false;
    } catch (e: any) {
      return false;
    }
  }


  parseConditionWorker(cond: string): Function | undefined {

    console.log("Parsing: " + cond);

    let f1: Function | undefined;

    f1 = this.parseForPrioAnd(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForOr(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForAnd(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForNegation(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForIgnorables(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForMajor(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForMinor(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForSuit(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForPlusInSuit(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForDistribution(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForPlus(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForMinus(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForInterval(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForUnbalanced(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForBalanced(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForMin(cond)
    if (f1 != undefined) return f1;

    f1 = this.parseForMax(cond)
    if (f1 != undefined) return f1;

    console.log("Error: " + cond + " could not be parsed.");
    throw new Error("Error: " + cond + " could not be parsed.");
//    return undefined;

  }

  parseForNegation(cond: string): Function | undefined {

    const regex = /(\!)(.*)/;
    const a = regex.exec(cond);

    if (a != null) {
      let cond = a[2];
      const f1 = this.parseConditionWorker(cond);
      if (f1 !== undefined) {
        return (hand: DealHand) => !f1(hand);
      }
    }
    return undefined;
  }

  parseForPlus(cond: string): Function | undefined {

    const regex = /(\d+)\+/;
    const a = regex.exec(cond);
    let f1: Function;

    if (a != null) {
      this.lowPoints = +a[1];
      f1 = (hand: DealHand) => hand.points() >= this.lowPoints;
      return f1;
    } else return undefined;
  }

  parseForMinus(cond: string): Function | undefined {

    const regex = /(\d+)\-$/;
    const a = regex.exec(cond);
    let f1: Function;

    if (a != null) {
      this.highPoints = +a[1];
      f1 = (hand: DealHand) => hand.points() <= this.highPoints;
      return f1;
    } else return undefined;
  }


  parseForOr(cond: string): Function | undefined {

    const regex = /(.+)\s(or|\|)(.*)/;
    const a = regex.exec(cond);
    if (a != null) {
      let evax = a[1];
      let evay = a[3];
      const f1 = this.parseConditionWorker(evax);
      const f2 = this.parseConditionWorker(evay);
      if (f1 !== undefined && f2 !== undefined) {
        console.log("Or successfully parsed");
        return (hand: DealHand) => f1(hand) || f2(hand);
      }
    }
    return undefined;
  }

  parseForPrioAnd(cond: string): Function | undefined {

    const regex = /(.+)(\&)(.*)/;
    const a = regex.exec(cond);
    if (a != null) {
      let evax = a[1];
      let evay = a[3];
      const f1 = this.parseConditionWorker(evax);
      const f2 = this.parseConditionWorker(evay);
      if (f1 !== undefined && f2 !== undefined) {
        console.log("And successfully parsed");
        return (hand: DealHand) => f1(hand) && f2(hand);
      }
    }
    return undefined;
  }

  parseForAnd(cond: string): Function | undefined {

    const regex = /(.+)(,|with)(.*)/;
    const a = regex.exec(cond);
    if (a != null) {
      let evax = a[1];
      let evay = a[3];
      const f1 = this.parseConditionWorker(evax);
      const f2 = this.parseConditionWorker(evay);
      if (f1 !== undefined && f2 !== undefined) {
        console.log("And successfully parsed");
        return (hand: DealHand) => f1(hand) && f2(hand);
      }
    }
    return undefined;
  }

  parseForSuit(cond: string): Function | undefined {

    const regex = /(\d+)(\+|\-)?(S|H|D|C)$/;
    const a = regex.exec(cond.trim());
    var f1: Function;

    if (a != null) {
      var length = +a[1];
      var suit = a[3];
      var suitNo = 0;
      if (suit == "S") suitNo = 3;
      if (suit == "H") suitNo = 2;
      if (suit == "D") suitNo = 1;
      if (suit == "C") suitNo = 0;
      if (a[2] == "+")
        f1 = (hand: DealHand) => hand.cardsInSuit(suitNo) >= length;
      else if (a[2] == "-")
        f1 = (hand: DealHand) => hand.cardsInSuit(suitNo) <= length;
      else {
        f1 = (hand: DealHand) => hand.cardsInSuit(suitNo) === length;
      }
      return f1;
    }
    return undefined;
  }

  parseForPlusInSuit(cond: string): Function | undefined {

    const regex = /(\d+)(\+|\-)?(S|H|D|C)points/;
    const a = regex.exec(cond.trim());
    let f1: Function;

    if (a != null) {
      this.lowPoints = +a[1];
      var suit = a[3];
      var suitNo = 0;
      if (suit == "S") suitNo = 3;
      if (suit == "H") suitNo = 2;
      if (suit == "D") suitNo = 1;
      if (suit == "C") suitNo = 0;
      f1 = (hand: DealHand) => hand.pointsInSuit(suitNo) >= this.lowPoints;
      return f1;
    } else return undefined;
  }

  parseForDistribution(cond: string): Function | undefined {

    const regex = /(\d\d\d\d)(.?)/;
    const a = regex.exec(cond);
    var f1: Function;

    if (a != null) {
      var distri = a[1];
      if (a[2] === 'a')
        return (hand: DealHand) => hand.distribution() === distri;
      else
        return (hand: DealHand) => hand.cardsInSuit(3) === +distri.substr(0, 1) &&
          hand.cardsInSuit(2) === +distri.substr(1, 1) &&
          hand.cardsInSuit(1) === +distri.substr(2, 1) &&
          hand.cardsInSuit(0) === +distri.substr(3, 1);
    }
    return undefined;
  }

  parseForMajor(cond: string): Function | undefined {
    const regex = /(\d+)(\+|\-)?M/;
    const a = regex.exec(cond);
    if (a != null) {
      var length = +a[1];
      if (a[2] == "+") {
        return (hand: DealHand) => (hand.cardsInSuit(2) >= length || hand.cardsInSuit(3) >= length);
      } else if (a[2] == "-")
        return (hand: DealHand) => (hand.cardsInSuit(2) <= length || hand.cardsInSuit(3) <= length);
      else
        return (hand: DealHand) => (hand.cardsInSuit(2) === length);
    }
    return undefined;
  }

  parseForIgnorables(cond: string): Function | undefined {
    const regex = /f1|F1|forced|asking|GF|must/;
    const a = regex.exec(cond);
    if (a != null) {
      return (hand: DealHand) => true;
    }
    return undefined;
  }


  parseForMinor(cond: string): Function | undefined {
    const regex = /(\d+)(\+|\-)?m/;
    const a = regex.exec(cond);
    if (a != null) {
      var length = +a[1];
      if (a[2] == "+") {
        return (hand: DealHand) => (hand.cardsInSuit(0) >= length || hand.cardsInSuit(1) >= length);
      }
    }
    return undefined;
  }

  parseForInterval(cond: string): Function | undefined {
    const regex = /(\d+)\-(\d+)/;
    const a = regex.exec(cond);
    if (a != null) {
      this.lowPoints = Math.max(+a[1], this.lowPoints);
      this.highPoints = Math.min(+a[2], this.highPoints);
      return (hand: DealHand) => (hand.points() >= +a[1]) && (hand.points() <= +a[2]);
    }
    return undefined;

  }

  parseForBalanced(cond: string): Function | undefined {
    const regex = /(bal)/;
    const a = regex.exec(cond);
    let f1: Function;

    if (a != null) {
      f1 = (hand: DealHand) => hand.isBalanced();
      return f1;
    } else return undefined;
  }

  parseForUnbalanced(cond: string): Function | undefined {
    const regex = /(unbal)/;
    const a = regex.exec(cond);
    let f1: Function;

    if (a != null) {
      f1 = (hand: DealHand) => !hand.isBalanced();
      return f1;
    } else return undefined;
  }

  parseForMin(cond: string): Function | undefined {
    const regex = /(min)/;
    const a = regex.exec(cond);

    if (a != null) {
      this.highPoints = (this.lowPoints + this.highPoints) / 2;
      return (hand: DealHand) => true;
    } else return undefined;
  }

  parseForMax(cond: string): Function | undefined {
    const regex = /(max)/;
    const a = regex.exec(cond);

    if (a != null) {
      this.lowPoints = (this.lowPoints + this.highPoints) / 2;
      return (hand: DealHand) => true;
    } else return undefined;
  }

  parseForSI(cond: string): Function | undefined {
    const regex = /(SI)/;
    const a = regex.exec(cond.trim());

    if (a != null) {
      this.lowPoints = (this.lowPoints + this.highPoints) / 2;
      return (hand: DealHand) => true;
    } else return undefined;
  }
}


//3+Dpoints
