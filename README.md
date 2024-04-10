# React + Vite Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Official Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Utilizes [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Utilizes [SWC](https://swc.rs/) for Fast Refresh.

## File Uploading

Please upload a text file containing an array of objects:

### Example:

```json
[
  {
    "startLatitude": "12.9716",
    "startLongitude": "77.5946",
    "endLatitude": "18.5204",
    "endLongitude": "73.8567",
    "time": "20"
  },
  {
    "startLatitude": "12.9716",
    "startLongitude": "77.5946",
    "endLatitude": "44.6844",
    "endLongitude": "10.9560",
    "time": "20"
  },
  {
    "startLatitude": "44.6844",
    "startLongitude": "10.9560",
    "endLatitude": "33.9240",
    "endLongitude": "38.7336",
    "time": "20"
  },
  {
    "startLatitude": "44.6844",
    "startLongitude": "10.9560",
    "endLatitude": "44.6844",
    "endLongitude": "10.9560",
    "time": "20"
  }
]
```
