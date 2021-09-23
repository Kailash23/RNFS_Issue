import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  DownloadDirectoryPath,
  downloadFile,
  readDir,
  unlink,
} from 'react-native-fs';

const downloadUrl =
  'https://appcenter-filemanagement-distrib2ede6f06e.azureedge.net/d9fed9d0-e39b-42f0-907d-863954fc37f8/Wings.apk?sv=2019-02-02&sr=c&sig=4kygLmGkvLjHSWm2%2F9yLfMnFPEF9FVHVEKyzfbHbNH8%3D&se=2021-09-23T08%3A56%3A44Z&sp=r';

async function downloadApk() {
  try {
    const result = await readDir(DownloadDirectoryPath);

    await Promise.all(
      result
        .filter(file => {
          const ext = file.name.split('.').pop();
          return (
            (file.name.includes('Wings') ||
              file.name.includes('app-release')) &&
            ext === 'apk'
          );
        })
        .map(({path}) => {
          return unlink(path);
        }),
    );
  } catch (error) {
    console.log(error);
  }

  const filePath = DownloadDirectoryPath + '/WingsApp.apk';
  const download = downloadFile({
    fromUrl: downloadUrl,
    toFile: filePath,
    progress: res => {
      console.log(res);
    },
    progressDivider: 1,
  });
  download.promise
    .then(res => {
      if (res.statusCode === 200) {
        console.log(res);
        console.log('Success');
      }
    })
    .catch(e => {
      console.log(e);
    });
}

export default function App() {
  return (
    <View style={styles.container} variant={'scroll'}>
      <TouchableOpacity onPress={downloadApk}>
        <Text style={{lineHeight: 100}}>Download</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center', flex: 1},
});
