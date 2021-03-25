import { CameraEngine } from "./CameraEngine";

export class CameraToggle {

    constructor(private cameraEngine: CameraEngine) {}

    public async on(): Promise<void> {
        await this.cameraEngine.currentLensInstance.cameraON();
    }

    public async off(): Promise<void> {
        await this.cameraEngine.currentLensInstance.cameraOFF();
    }
}