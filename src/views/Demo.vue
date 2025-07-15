<template>
<div>demo page</div>  
  <div>
      <iframe src="/iframe.html" style="width:100%; height:400px;"></iframe>
  </div>
</template>
  
  <script>

  //let test = ['a','b','c']

  export default {
    name: 'demoPage'  ,
    data(){
      return {
        htmlContent: `
            <html>
            <body>
                <h1>Hello from iframe</h1>
                <p>This is injected HTML</p>
            </body>
            </html>
        `
        }
    }
  }


  </script>
  <style>

  </style>