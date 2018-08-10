$(document).ready(function(){

    (()=>{
        let pageTitle, websitename, PagePriority;
        let crUrl = document.URL.split("?");
        if(crUrl.indexOf("edit") != -1){
            pageTitle = escape($("#pagetitle").val().trim());
            websitename = escape($("#websitename").val().trim());
            PagePriority = escape($("#pagepriority").val().trim());

            if(pageTitle && websitename && PagePriority){
                $(".page-wrapper").removeClass("titlenotset");
                $(".detailsnotentered").css({display: 'none'});
            }
        }

        $("#pagedetailsform").on("change keyup", (e)=>{

            pageTitle = escape($("#pagetitle").val().trim());
            websitename = escape($("#websitename").val().trim());
            PagePriority = escape($("#pagepriority").val().trim());

            if(pageTitle.length > 0 && pageTitle && websitename && PagePriority){
                $(".page-wrapper").removeClass("titlenotset");
                $(".detailsnotentered").css({display: 'none'});
                
                getFrameworkComponentsfromchosensite(websitename.toString().trim());

            }else{
                $(".page-wrapper").addClass("titlenotset");
                $(".detailsnotentered").css({display: 'block'});
            }

        });

        

    })();
    $(".viewMoreDetails").click(()=>{
        $("#optionalmeta").slideToggle(300);
    });

    //getting componets from server
    function getFrameworkComponentsfromchosensite(val){

        $.ajax({
            method: 'GET',
            url: `http://localhost:3000/components/${val}`,
            success: (data)=>{
                //console.log(data);
                if(data.resp.length > 0){

                    let html = '';
                    for(let i = 0; i < data.resp.length; i++){
                        html += `<div class="dragcontainer" data-index="${i}"><span class="componentname">${data.resp[i].title}</span>${data.resp[i].code}</div>`;
                        console.log(data.resp[i]);
                    }
                    $("#dragablecomponents").empty().append(html);

                }
                
            },
            error: (err)=>{
                console.log(err);
            }
        });

    }
    function getAllsites(){

        $.ajax({
            url: 'http://localhost:3000/website',
            method: 'GET',
            success: (data)=>{
                console.log(data);
                let html = "";
                for(let dt of data.resp){

                    html += `<option value="${dt.framework}" data-framework="${dt.framework}">${dt.title}</option>`;
                    
                }

                $("#websitename").append(html);
                
            }
        });

    }
    getAllsites();

    $("#savethispage").click((e)=>{
        e.preventDefault();
        let pageTitle = escape($("#pagetitle").val().trim());
        let websitename = escape($("#websitename").val().trim());
        let PagePriority = escape($("#pagepriority").val().trim());
        if(pageTitle.length > 0 && pageTitle && websitename && PagePriority){

            

        }else{
            swal(
                'Warning!',
                'Cant save page withut required details.',
                'warning'
                )
        }
    });

    var drake = dragula([document.getElementById("dragablecomponents"), document.getElementById("dragtocontainer")], {
        copy: function (el, source) {
          return source === document.getElementById("dragablecomponents")
        },
        accepts: function (el, target) {
          return target !== document.getElementById("dragablecomponents")
        }
      });

      drake.on("drop", function(el, target, source, sibling){

        var editcontent = `<div class="modify" style="
                            position: absolute;
                            top: 0px;
                            right: 2px;
                        "><button type="button" class="btn btn-primary waves-effect editbuilderBlock">Edit</button>
                        <button type="button" class="btn btn-danger waves-effect removebuilderBlock">Remove</button>
                            </div>`;

        if(target && target.id == "dragtocontainer"){
            $(el).find(".modify").remove();
            $(el).prepend(editcontent);
            //let index = $(el).index();
            //$(el).attr("data-index", index);
           //console.log("dopped", el, target, source, sibling, $(el).index());
        }
        
        $(".removebuilderBlock").click(removeBuilderBlock);
        $(".editbuilderBlock").click(EditThisCurrentBlock);
      })

      function removeBuilderBlock(e){

        let thisSection = $(this);
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Remove!'
            }, (result) => {
            if (result) {

                thisSection.closest(".dragcontainer").remove();

                swal(
                'Removed!',
                'Section has been removed.',
                'success'
                )
            }
        })


      }
      
      //edit onclick
      function EditThisCurrentBlock(){

          $(".dragcontainer").removeClass("active");
          $(this).closest(".dragcontainer").addClass("active");
          let tobeEdited = $(this).closest(".modify").siblings(".innercontent").data("edit");
          let thisToedit = $(this).closest(".modify").siblings(".innercontent");

        $(".editingArea").css({height: '30vh'});
          if(tobeEdited && tobeEdited == 'text'){

              startShowingEdits(thisToedit, "text");

          }

      }

      //passing edit data
      function startShowingEdits(thisEdit, type){
          let htmlArray = [];

          switch(type){
              case "text":
                    htmlArray[htmlArray.length] = `<div class="form-group">
                                <label>Edit ${type} component</label>
                                <textarea class="form-control" id="editPositionfield" rows="5">${thisEdit.text()}</textarea>
                            </div>`;
                    break;
              default:
                    htmlArray = [];

          }
        
        //run through array and push values
        if(htmlArray.length > 0){
            htmlArray.forEach((htmlForEditFields)=>{
                $(".editingArea").empty().append(htmlForEditFields);
            });
            
        }

        $("#editPositionfield").keyup(function(){
            //console.log($(this).val());
            let keyVal = $(this).val().trim();

            repondToChangestofield(thisEdit, keyVal);

        });

      }

      function repondToChangestofield(thisEdit, keyVal){

        $(thisEdit).text(keyVal);

      }

      $("#showpagedetails").click(()=>{

          $(".pagedetails").slideToggle(300, function(){
            
            $(this).css("display") == "none" ? $(this).removeClass("notShowing showing").addClass("notShowing") : $(this).removeClass("notShowing showing").addClass("showing")

          });
         
          
      });

      $(window).scroll(()=>{
          let screenTop = $(window).scrollTop();

          if($(".pagedetails").attr("class").split(" ").indexOf("showing") != -1){

            if(screenTop > 100){
                $(".pagedetails").slideUp(300);
            }else{
                $(".pagedetails").slideDown(300);
            }

          }
          
      });

});