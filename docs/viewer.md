---
nav:
  title: Viewer
  path: /viewer
---

### Start

Demo:

```tsx
import React, {useState, useEffect} from 'react';
import * as THV from '@wayyolo/three-viewer';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const areaList = [
  {
    id: '9999999',
    areaNo: 0,
    name: '全工区'
  },
  {
    id: '805',
    areaNo: 1,
    name: '一工区'
  },
  {
    id: '808',
    areaNo: 2,
    name: '二工区'
  },
  {
    id: '2132',
    areaNo: 3,
    name: '三工区'
  },
  {
    id: '806',
    areaNo: 4,
    name: '四工区'
  },
  {
    id: '807',
    areaNo: 5,
    name: '五工区'
  }
]
let embeddedViewer = null;
let intervalTime = null;
let timeoutTime = null;
let controls = null;
const BIM = () => {
  const [currAreaNo, setCurrAreaNo] = useState(0)
  useEffect(() => {
    // OV.SetExternalLibLocation ('libs');
    // get the parent element of the viewer
    let parentDiv = document.getElementById ('bim');

    // initialize the viewer with the parent element and some parameters
    embeddedViewer = new THV.EmbeddedViewer (parentDiv, {
        backgroundColor : new THV.RGBAColor (255, 255, 255, 0),
        onModelLoaded : () => {
            let model = embeddedViewer.GetModel ();
            controls = new OrbitControls( embeddedViewer.viewer.camera, embeddedViewer.viewer.renderer.domElement );
            // stop autorotate after the first interaction
            controls.addEventListener('start', function(){
              clearTimeout(timeoutTime);
              controls.autoRotate = false;
            });

            // restart autorotate after the last interaction & an idle time has passed
            controls.addEventListener('end', function(){
              clearTimeout(timeoutTime);
              timeoutTime = setTimeout(function(){
                controls.autoRotate = true;
                controls.target.x = embeddedViewer.viewer.navigation.camera.center.x
                controls.target.y = embeddedViewer.viewer.navigation.camera.center.y
                controls.target.z = embeddedViewer.viewer.navigation.camera.center.z
                animate()
              }, 5000);
            });
            if(!timeoutTime){
              embeddedViewer.viewer.navigation.Zoom(0.28)
              console.log(controls)
              controls.autoRotate = true;
              controls.autoRotateSpeed = 8;
              controls.target.x = embeddedViewer.viewer.navigation.camera.center.x
              controls.target.y = embeddedViewer.viewer.navigation.camera.center.y
              controls.target.z = embeddedViewer.viewer.navigation.camera.center.z
              animate()
            }
            highlightArea(0)
        }
    });
    // load a model providing model urls
    embeddedViewer.LoadModelFromUrlList ([
        'https://raw.githubusercontent.com/WayYOLO/three-viewer/main/assets/model/good.obj',
        'https://raw.githubusercontent.com/WayYOLO/three-viewer/main/assets/model/good.mtl'
    ]);
    console.log(embeddedViewer)
  }, [])

  const animate = () => {
    intervalTime = requestAnimationFrame(animate)
    controls.update();
    embeddedViewer.viewer.renderer.render(embeddedViewer.viewer.scene, embeddedViewer.viewer.camera)
  }

  const highlightArea = (areaNo) => {
    const id = areaList.find(item => item.areaNo === areaNo).id
    embeddedViewer.viewer.SetMeshesVisibility ((meshUserData) => {
        if (areaList.find(item => +item.id === meshUserData.originalMeshId.meshIndex) &&  meshUserData.originalMeshId.meshIndex !== +id) {
            return false;
        }
        return true;
    });
  }

  const handleAreaChange = (event) => {
    clearTimeout(timeoutTime);
    cancelAnimationFrame(intervalTime);
    controls.autoRotate = false;
    timeoutTime = setTimeout(function(){
        controls.autoRotate = true;
        controls.target.x = embeddedViewer.viewer.navigation.camera.center.x
        controls.target.y = embeddedViewer.viewer.navigation.camera.center.y
        controls.target.z = embeddedViewer.viewer.navigation.camera.center.z
        animate()
      }, 5000);
    const areaNo =  +event.target.value
    setCurrAreaNo(areaNo)
    if(areaNo === 0) {
      fitModelToWindow()
    } else {
      fitMeshToWindow(areaNo)
    }
    highlightArea(areaNo)
  }

  const fitModelToWindow = () => {
    let boundingSphere = embeddedViewer.viewer.GetBoundingSphere ((meshUserData) => {
      return meshUserData;
    });
    embeddedViewer.viewer.FitSphereToWindow (boundingSphere, true);
  }

  const fitMeshToWindow = (areaNo) => {
    const id = areaList.find(item => item.areaNo === areaNo).id
    let boundingSphere = embeddedViewer.viewer.GetBoundingSphere ((meshUserData) => {
      return meshUserData.originalMeshId.meshIndex ===  +id;
    });
    embeddedViewer.viewer.FitSphereToWindow (boundingSphere, true);
  }

  return (
    <div className="bim-container">
      <div className="tree">
        <select value={currAreaNo} onChange={handleAreaChange}>
          {areaList.map(item => <option key={item.areaNo} value={item.areaNo}>{item.name}</option>)}
        </select>
      </div>
      <div id="bim" style={{height: 500}} />
    </div>
  )
}

export default BIM
```

<!-- More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo -->
