importPackage(android.util);
importPackage(java.io);
importPackage(Packages);
importPackage(Packages.android.graphics)
importPackage(Packages.androidx.palette.graphics.Palette)

const rectF = new RectF(0, 0, 250, 250)
//gauge매개변수는 gauge/100
function createUserCard(name,profileBitmap,lv,exp,maxExp){
    const bitmap = Bitmap.createBitmap(800,800, Bitmap.Config.ARGB_8888);
    const canvas = new Canvas(bitmap)
    const paint = new Paint();
    canvas.drawColor(Color.WHITE);
    
   /* paint.setColor(Color.GRAY);
    canvas.drawCircle(155, 155,125 , paint);*/
    var ttfPath = "/sdcard/StarLight/projects/hello/assets/Tenada.ttf"; // TTF 파일 경로
    var typeface = Typeface.createFromFile(new File(ttfPath));

    paint.setTypeface(typeface)
    paint.setColor(createARGB(255, 18, 178, 248)); 
    paint.setTextSize(80); 
    canvas.drawText(name, 300, 200, paint); 
    
    paint.setColor(createARGB(255, 33, 103, 212)); 
    paint.setTextSize(120); 
    canvas.drawText(`Lv.${lv}`, 300, 320, paint); 
    
    paint.setColor(createARGB(255, 39, 54, 164)); 
    paint.setTextSize(40); 
    canvas.drawText(`Exp) ${exp}/${maxExp}`, 20, 480, paint); 
    
    paint.setColor(Color.BLACK); 
    const rect1 = new RectF(10, 500, 10+780, 500+60);
    canvas.drawRoundRect(rect1,50,50,paint)
    
    const gaugePer = (exp/maxExp)*780
    paint.setShader(new LinearGradient(0,0,800,0,createARGB(255, 9, 107, 241), createARGB(255, 61, 189, 238), android.graphics.Shader.TileMode.CLAMP));
    const rect2 = new RectF(10, 500, 10+gaugePer, 500+60);
    canvas.drawRoundRect(rect2,50,50,paint)
    
    var roundedBitmap = createRoundedBitmap(profileBitmap, 250, 250, 125)
    canvas.drawBitmap(roundedBitmap, 30, 100, paint)
    
    showImage(bitmap)
    return bitmapToBase64(bitmap)
}

function createARGB(alpha, red, green, blue) {
    return (alpha << 24) | (red << 16) | (green << 8) | blue; // ARGB 값 생성
}

function createRoundedBitmap(source, width, height, cornerRadius) {
        var output = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        var canvas = new Canvas(output)

        var rect = new RectF(0, 0, width, height)
       
        var paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setColor(Color.WHITE); 

        canvas.drawRoundRect(rectF, cornerRadius, cornerRadius, paint)

        // 비트맵 클리핑
        paint.xfermode = PorterDuffXfermode(PorterDuff.Mode.SRC_IN)
        canvas.drawBitmap(source, null, rect, paint)

        return output
} 

function sendImageToServer(base64Image){ 
    const response = org.jsoup.Jsoup.connect("https://api.imgbb.com/1/upload") 
      .data("key", "7ffce853d2d38cb788c923932bc73454") 
      .data("image", base64Image) 
      .data("name", Date.now()) 
      .ignoreContentType(true) 
      .ignoreHttpErrors(true) 
      .timeout(30000) 
      .post(); 
      
      const result = JSON.parse(response.text()); 
      return result
}

function bitmapToBase64(bitmap){
    let baos = new ByteArrayOutputStream();
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
    let bytes = baos.toByteArray();
    let temp = Base64.encodeToString(bytes, Base64.DEFAULT);
    let dataUrl = temp.trim();
    return dataUrl
}

function showImage (bitmap) {

    Api.UIThread(function() { var toast = new android.widget.Toast(Api.getContext()); var image = new android.widget.ImageView(Api.getContext()); image.setImageBitmap(bitmap); toast.setView(image); toast.show(); });

    return true;

}