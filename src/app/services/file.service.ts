import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BNode} from "../model/BNode";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  bridgeSystemUrl = 'assets/bridgePrecision.json';
  public systemHierarchy: { [index: string]: any } = {};
  public bnode!: BNode;

  private newSystem!: BNode;

  constructor(private http: HttpClient) {
  }

  // loadSystem() {
  //   var getter = this.getLocalBridgeSystem();
  //   getter.subscribe(
  //     (data: {}) => {
  //       this.systemHierarchy = data;
  //       const l = new LegacyBiddingSystem();
  //       this.bnode = l.parseToNew(this.systemHierarchy);
  //     }
  //   );
  //   return getter;
  // }

  getLocalBridgeSystem() {
    return this.http.get(this.bridgeSystemUrl);
  }

  // parseLegacySystem() :BNode{
  //   let leg : LegacyBiddingSystem = new LegacyBiddingSystem();
  //   leg.systemHierarchy = this.systemHierarchy;
  //   console.log(this.systemHierarchy);
  //   return leg.parseToNew(this.systemHierarchy);
  //
  // }

  saveIntoLocalStorage(name: string, bnode: BNode) {
    const json = JSON.stringify(bnode, ["id", "bid", "condition", "description", "nodes", "who"]);
    localStorage.setItem(name, json.toString());
  }


  loadFromLocalStorage(name: string): BNode | undefined {
    const json = localStorage.getItem(name);
    if (json) {
      return JSON.parse(json) as BNode;
    }
    return undefined;
  }

  downloadSystem(name: string, bnode: BNode) {
    const biddingSystem = JSON.stringify(bnode);
    var wea = window.open("", "hallo");
    if (wea) {
      wea.document.write(biddingSystem);
    }
    var text = biddingSystem,
      blob = new Blob([text], {type: 'text/plain'}),
      anchor = document.createElement('a');

    anchor.download = "bs.json";
    anchor.href = (window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }

  // uploadSystem(file: File): BNode {
  //
  //   const fileReader = new FileReader();
  //   fileReader.onload = fileLoadedEvent => {
  //     var datae: string | ArrayBuffer | null;
  //     datae = fileReader.result
  //     if (datae) {
  //       const bn = JSON.parse(datae.toString()) as BNode;
  //     }
  //   }
  //   fileReader.readAsText(file);
  //
  // }

  getLinExample() {
    return this.http.get("https://www.bridgebase.com/myhands/fetchlin.php?id=1022970755&when_played=1616782848");
  }


}
