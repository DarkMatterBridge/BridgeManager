import {Component, Input, OnInit} from '@angular/core';
import {BNode} from "../model/BNode";
import {BiddingSystem} from "../model/BiddingSystem";
import {BridgeSystemManager} from "../services/bridge-system-manager.service";
import {Subject} from "rxjs";
import {FileService} from "../services/file.service";
import {LegacyBiddingSystem} from "../model/LegacyBiddingSystem";

@Component({
  selector: 'app-bid-jar',
  templateUrl: './bid-jar.component.html',
  styleUrls: ['./bid-jar.component.scss']
})
export class BidJarComponent implements OnInit {

  bnode!: BNode;
  baseNode!: BNode;

  subject: Subject<BNode> = new Subject<BNode>();
  bridgeSystem: BiddingSystem;

  constructor(private  bsm: BridgeSystemManager, private fileService: FileService) {
    this.bridgeSystem = new BiddingSystem(bsm);
  }

  ngOnInit(): void {
    this.subject.asObservable().subscribe(b => this.setBnode(b));
    this.getStatistics();

    // this.fileService.getLocalBridgeSystem().subscribe(
    //   (data: {}) => {
    //     const l = new LegacyBiddingSystem();
    //     BNode.highestId = -1;
    //     this.baseNode = l.parseToNew(data);
    //     this.bnode = this.baseNode;
    //     this.getStatistics();
    //   }
    // )

  }

  setBnode(bn: BNode | undefined) {
    if (bn === undefined) {
      this.bnode = this.baseNode;
    } else {
      this.bnode = bn;
    }
  }

  getStatistics() {
    const hid =
    this.bsm.determineAndSetHighestId(this.baseNode);
    const nobids =
    this.bsm.getTotalBidList(this.baseNode).size;

    alert ("Highest ID: "+hid+" No of bids: "+nobids)
  }

  loadLegacySystem() {
    this.fileService.getLocalBridgeSystem().subscribe(
      (data: {}) => {
        const l = new LegacyBiddingSystem(this.bsm);
        BNode.highestId = -1;
        this.baseNode = l.parseToNew(data);
        this.bnode = this.baseNode;
        this.getStatistics();
      }
    )

  }

  loadNewSystem() {
    this.bridgeSystem = new BiddingSystem(this.bsm);
    this.baseNode = this.bridgeSystem.bridgeSystem;
    this.bnode = this.baseNode;

  }

  resetSystem() {
    this.bridgeSystem = new BiddingSystem(this.bsm);
    this.baseNode = this.bridgeSystem.bridgeSystem;
    this.bnode = this.baseNode;
  }

  loadElementarySystem() {
    this.bridgeSystem = new BiddingSystem(this.bsm);
    this.bridgeSystem.setElementarySystem();
    this.baseNode = this.bridgeSystem.bridgeSystem;
    this.bnode = this.baseNode;
  }

}
