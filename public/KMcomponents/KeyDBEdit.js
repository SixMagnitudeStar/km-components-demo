
$(document).ready(function () {    
    $(".KeyDBEdit").each(function(){  
		var ID = $(this).attr("ID");
		window[ID] = new KeyDBEdit(ID,$(this));               
		window[ID].Init();
		window[ID].RefreshData();         
		window[ID].EventBind();         
    });     
});

const KeyDBEdit = function(ID, Element){
	this.ID = ID;
	this.Element = Element;

	this._Input = null;

	//取得DataSet//   
    this.DataSet = null;
    if(typeof(Element.attr("DataSet")) != "undefined") {          
        this.DataSet = window[Element.attr("DataSet")];          
    }   

    //取得資料Field
    this.Field = "";
    if (typeof(Element.attr("Field")) != "undefined") {  
        this.Field = Element.attr("Field");
    }  

    this._Visible = "true";
    if (typeof(Element.attr("Visible")) != "undefined"){
    	this._Visible =Element.attr('Visible');
    }

    this.OnChangeFunc = null;
    if(typeof(Element.attr("OnChangeFunc")) != "undefined") {  
        this.OnChangeFunc = Element.attr("OnChangeFunc");
    } 
}

Object.defineProperty(KeyDBEdit.prototype, "Value",{
	get: function(){
		return this._Input.val() ? this._Input.val() : "";
	},
	set: function(value){
		this._Input.val(value);
		this._Input.change();
	}
})



Object.defineProperty(KeyDBEdit.prototype, "Enabled",{
	get: function(){
		return !this._Input.prop('readonly');
		//
	},set: function(value){
		this._Input.prop('readonly',!Boolean(value));

		// 根據 enabled狀態設置背景顏色
		if (value){
			this._Input.css({
				'border': 'none',
				'background-color': 'white'
			});

			//觸發綁定在change事件的必填欄位檢測，依據欄位值改變輸入框樣式
			this._Input.change();
		}else{
			this._Input.css({
				'border': 'none',
				'background-color': '#D3D3D3'
			});
		}
	}
})



Object.defineProperty(KeyDBEdit.prototype, "Visible",{
	get: function(){
		return this.Element.is(":visible");

	},
	set: function(value){
		if (Boolean(value)){
			this.Element.show();
		}else{
			this.Element.hide();
		}
	}
})

Object.defineProperty(KeyDBEdit.prototype, "Required",{
	get: function(){
		return this._Input.prop("Required");
	},
	set: function(value){
		if (Boolean(value)){
			this._Input.prop("Required", true);
		}else{
			this._Input.prop("Required", false);
		}
		this._Input.change();
	}
})

KeyDBEdit.prototype._DefaultStyle = {        
        //字體大小(單位用 vw 才會跟著解析度縮放)
        FontSize      		   : "3vw",       //預設資料字體大小
        FontColor    	       : "#000000",        //預設資料字體顏色        

        LabelFontSize		   : "3vw",		//預設標題字體大小
        LabelFontColor		   : "	#000000" ,		//預設標題字體顏色  

        LookupField2FontSize   : "3vw",		//預設Lookupfield2字體大小
        LookupField2FontColor  : "#8E8E8E", 		//預設Lookupfield2字體顏色
        FocusColor			   : "green"     
};


KeyDBEdit.prototype.Init = function(){
	//物件HTML結構參考 :

	//<p>標題</p>
	//<input>

	//code order:
	//1. 抓取標題參數　　　　　 		
	//2. 創建DOM元素			   
	//3. 取得CSS樣式設定　　			　　
	//4. DOM元素套上CSS     				
	//5. 標題物件放入主DOM(Input前面)    


	//// 抓取主要參數
    let LabelText = this.Element.attr('LabelText'); //抓取title


    //// 創建DOM元素
    let input = $('<input>');//輸入框
    this._Input = input;

	let CurOnChangeFunc = this.OnChangeFunc;

    input.on('change', ()=>{
    	if (CurOnChangeFunc && typeof window[CurOnChangeFunc] === "function") {
            window[CurOnChangeFunc]();  // 執行 MyFunc()
        }
    })

    this._Input.prop('Required',this.Element.attr('Required'));

    let label  = $('<p></p>');// DBEdit的標題
    let container = $('<div></div>')//容器
	////


	//// 取得CSS樣式設定
    let FontSize = this._DefaultStyle.FontSize;////取得預設資料字體大小 
    if(typeof(this.Element.attr("FontSize")) != "undefined") {  
        FontSize = this.Element.attr("FontSize");//依據自定義參數改值
    }             

    let FontColor = this._DefaultStyle.FontColor;//取得資料文字顏色
    if(typeof(this.Element.attr("FontColor")) != "undefined") {  
        FontColor = this.Element.attr("FontColor");
    } 

    let LabelFontSize = this._DefaultStyle.LabelFontSize;//取得標題預設資料字體大小
    if(typeof(this.Element.attr("LabelFontSize")) != "undefined") {
    	LabelFontSize = this.Element.attr("LabelFontSize");
    }

    let LabelFontColor = this._DefaultStyle.LabelFontColor;//取得標題資料文字顏色
    if(typeof(this.Element.attr("LabelFontColor")) != "undefined") {
    	LabelFontColor = this.Element.attr("LabelFontColor");
    }

    let FocusColor = this._DefaultStyle.FocusColor;
    if(typeof(this.Element.attr("FocusColor")) != "undefined"){
    	FocusColor = this.Element.attr("FocusColor");
    }


    //// DOM元素套上CSS
    input.css({// <Input> 標籤套上CSS
		'margin-top'	: '0px',
		'font-size'     : FontSize,
		'color'         :FontColor,
		'background-color': 'white'

    })

    //必填樣式
	if (this.Required){
		if (this.Value.trim() === ""){
			this._Input.css('background-color', '#FF7575');
		} else{
			this._Input.css('background-color', 'white');
		}
	}

    //focus時邊框變色
    input.on('focus', function(){
    	input.parent().css({
    		'border-color' : FocusColor,
    		'border-width' : '3px'
    	});
    })

    input.on('blur', function(){
    	input.parent().css({
    		'border-color' : '',
    		'border-width' : ''
    	});
    })



	if (label){// 標題<p>標籤套上css和給值
	    label.text(LabelText);
	    label.css({
	    	'margin'	: '24px 0 0 0',
	        'font-size'     : LabelFontSize,
	        'color'         : LabelFontColor,
	        'height'	: 'auto'

	        });
	}

	container.css("margin","0").css("border-color","gray");

	//// 創建的jQuery物件放入主DOM
	container.append(label);
	container.append(input);

	this.Element.append(container);
    this.Element.enhanceWithin();

    //顯示設定
    if (this._Visible === 'true'){
    	this.Element.show();
    }else{
    	this.Element.hide();
    }

	input.parent().css("margin", "0");//消除標題與輸入框的margin
}


KeyDBEdit.prototype.RefreshData = function(){	

	if (this.DataSet){
		let state = this.DataSet.State;//

	    let FieldValue = this.DataSet ? this.DataSet.FieldByName(this.Field).Value.trim() : "";    

	    this._Input.val(FieldValue);   
		this._Input.change();

		this.DataSet.State = state;//
	}
}

// 綁定相關事件
KeyDBEdit.prototype.EventBind = function(){
	this.UpdateCheck();
	this.RequiredFieldCheck();
	this.RefreshEnabled();
};



KeyDBEdit.prototype.RefreshEnabled = function(){
	if (this.Element.attr("Enabled")){
		//
		if (this.Element.attr("Enabled").toLowerCase() === "false"){
			this.Enabled = false;
		}else{
			this.Enabled = true;
		}
	}else{
		if (this.DataSet){
			this.Enabled = (this.DataSet.State === 'UPDATE' || this.DataSet.State === "INSERT") ? true : false;
		}
	}
}


// 異動值回寫DataSet
KeyDBEdit.prototype.UpdateCheck = function(){
	if (!this.DataSet) return;
	let OldValue = '';

	this._Input.on('focus', ()=>{
		OldValue = this._Input.val();
	});

	this._Input.on('change', ()=>{
		if (OldValue !== this._Input.val() && this.DataSet){
			this.DataSet.FieldByName(this.Field).Value=this._Input.val();
			this.DataSet.Edit();
		}	
	})

};

// 必填欄位樣式設定
KeyDBEdit.prototype.RequiredFieldCheck = function(){
	this._Input.on('change', ()=>{
		if (!this.Enabled) return;
		if (this.Required){
			if (this.Value.trim() === ""){
				this._Input.css('background-color', '#FF7575');

			} else{
				this._Input.css('background-color', 'white');
			}
		}
	})
}

