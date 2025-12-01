module.exports = {
  packagerConfig: {
    icon: 'assets/images/icon' 
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel', // para Windows (instalador)
      config: {
        iconUrl: 'https://example.com/path/to/icon.ico', // URL pública, puede ser la misma que local o una en internet
        setupIcon: 'assets/images/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-deb', // para Linux
      config: {
        options: {
          icon: 'assets/images/icon.png' // Aquí necesitas un png para Linux, idealmente 512x512
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg', // para macOS
      config: {
        icon: 'assets/images/icon.icns' // Para mac, necesitas formato icns
      }
    },
    {
      name: '@electron-forge/maker-wix', // para Windows MSI
      config: {
        icon: 'assets/images/icon.ico'
      }
    }
  ]
};
