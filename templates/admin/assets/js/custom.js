function toSlug(title){
    let slug = title.toLowerCase(); //Chuyển thành chữ thường

    slug = slug.trim(); //Xoá khoảng trắng 2 đầu

    //lọc dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'u');
    slug = slug.replace(/đ/gi, 'd');

    //chuyển dấu cách (khoảng trắng) thành gạch ngang
    slug = slug.replace(/ /gi, '-');

    //Xoá tất cả các ký tự đặc biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');

    return slug;
}

let sourceTitle = document.querySelector('.slug');
let slugRender = document.querySelector('.render-slug');

let renderLink = document.querySelector('.render-link');
if (renderLink!==null){

    //Lấy slug
    let slug = '';
    if (slugRender!==null){
        slug = '/'+slugRender.value.trim();
    }

    renderLink.querySelector('span').innerHTML = `<a href="${rootUrl+slug}" target="_blank">${rootUrl+slug}</a>`;
}
if (sourceTitle!==null && slugRender!==null){
    sourceTitle.addEventListener('keyup', (e)=>{

        if (!sessionStorage.getItem('save_slug')){
            let title = e.target.value;

            if (title!==null){
                let slug = toSlug(title);

                slugRender.value = slug;
            }
        }

    });

    sourceTitle.addEventListener('change', ()=>{
        sessionStorage.setItem('save_slug', 1);

        let currentLink = rootUrl+'/'+prefixUrl+'/'+slugRender.value.trim()+'.html';

        renderLink.querySelector('span a').innerHTML=currentLink;
        renderLink.querySelector('span a').href=currentLink;
    });

    slugRender.addEventListener('change', (e)=>{
        let slugValue = e.target.value;
        if (slugValue.trim()==''){
            sessionStorage.removeItem('save_slug');
            let slug = toSlug(sourceTitle.value);
            e.target.value = slug;
        }

        let currentLink = rootUrl+'/'+prefixUrl+'/'+slugRender.value.trim()+'.html';

        renderLink.querySelector('span a').innerHTML=currentLink;
        renderLink.querySelector('span a').href=currentLink;
    });

    if (slugRender.value.trim()==''){
        sessionStorage.removeItem('save_slug');
    }
}


//Xử lý ckeditor với class
let classTextarea = document.querySelectorAll('.editor');
if (classTextarea!==null){
    classTextarea.forEach((item, index)=>{
        item.id = 'editor_'+(index+1);
        CKEDITOR.replace(item.id);
    });
}

//Xử lý mở popup ckfinder

function openCkfinder(){
    let chooseImages = document.querySelectorAll('.choose-image');
    if (chooseImages!==null){
        chooseImages.forEach(function(item){

            item.addEventListener('click', function(){

                let parentElementObject = this.parentElement;
                while (parentElementObject){

                    parentElementObject = parentElementObject.parentElement;

                    if (parentElementObject.classList.contains('ckfinder-group')){
                        break;
                    }
                }

                CKFinder.popup( {
                    chooseFiles: true,
                    width: 800,
                    height: 600,
                    onInit: function( finder ) {
                        finder.on( 'files:choose', function( evt ) {
                            let fileUrl = evt.data.files.first().getUrl(); //Xử lý chèn link ảnh vào input

                            parentElementObject.querySelector('.image-render').value = fileUrl;
                        } );
                        finder.on( 'file:choose:resizedImage', function( evt ) { let fileUrl = evt.data.resizedUrl;
//Xử lý chèn link ảnh vào input
                            parentElementObject.querySelector('.image-render').value = fileUrl;
                        } ); }
                } );
            });

        });
    }
}

openCkfinder();

//Xử lý thêm dữ liệu dưới dạng Repeater

const galleryItemHtml = `<div class="gallery-item">
                            <div class="row">
                                <div class="col-11">
                                    <div class="row ckfinder-group">
                                        <div class="col-10">
                                            <input type="text" class="form-control image-render" name="gallery[]" placeholder="Đường dẫn ảnh..." value=""/>
                                        </div>
                                        <div class="col-2">
                                            <button type="button" class="btn btn-success btn-block choose-image">Chọn ảnh</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1">
                                    <a href="#" class="remove btn btn-danger btn-block"><i class="fa fa-times"></i> </a>
                                </div>
                            </div>

                        </div><!--End .gallery-item-->`;

const addGalleryObject = document.querySelector('.add-gallery');
const galleryImagesObject = document.querySelector('.gallery-images');

if (addGalleryObject!==null && galleryImagesObject!==null){
    addGalleryObject.addEventListener('click', function (e) {
        e.preventDefault();

        let galleryItemHtmlNode = new DOMParser().parseFromString(galleryItemHtml, 'text/html').querySelector('.gallery-item');

        galleryImagesObject.appendChild(galleryItemHtmlNode);

        openCkfinder();

    });

    galleryImagesObject.addEventListener('click', function(e){
        e.preventDefault(); //Ngăn tình trạng mặc định html (Thẻ a)
        if (e.target.classList.contains('remove') || e.target.parentElement.classList.contains('remove')){

            if (confirm('Bạn có chắc chắn muốn xoá?')){
                let galleryItem = e.target;
                while (galleryItem) {

                    galleryItem = galleryItem.parentElement;

                    if (galleryItem.classList.contains('gallery-item')) {
                        break;
                    }
                }

                if (galleryItem !== null) {
                    galleryItem.remove();
                }

            }
        }
    });
}

const slideItemHtml = `<div class="slide-item" style=" margin-bottom: 10px ; border: 3px outset  #f5f5f5;">
                                    <div class="row">
                                        <div class="" style="padding-left: 8px; margin-right: 10px; ">
                                            <span class="btn btn-info " style="margin-bottom: 10px; width: 6%%">Slide (chưa thêm)</span>
                                        </div>
                                        <div class="" style="width: 4%;margin-top: 4px;">
                                            <a href="#" class="btn btn-danger btn-sm btn-block remove" style="" >Xóa</a>
                                        </div>
                                    </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="row" style=" padding-left: 10px">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Tiêu đề</label>
                                            <input type="text" class="form-control" name="home_slide[slide_title][]" placeholder="Tiêu đề slide..."/>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Nút xem thêm</label>
                                            <input type="text" class="form-control" name="home_slide[slide_button_text][]" placeholder="Chữ của nút..."/>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Link xem thêm</label>
                                            <input type="text" class="form-control" name="home_slide[slide_button_link][]" placeholder="Link của nút..."/>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Link Youtube</label>
                                            <input type="text" class="form-control" name="home_slide[slide_video][]" placeholder="Link video youtube..."/>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Ảnh 1</label>
                                            <div class="row ckfinder-group">
                                                <div class="col-10">
                                                    <input type="text" class="form-control image-render" name="home_slide[slide_image_1][]" placeholder="Đường dẫn ảnh..." value=""/>
                                                </div>
                                                <div class="col-2">
                                                    <button type="button" class="btn btn-success btn-block choose-image"><i class="fa fa-upload" aria-hidden="true"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Ảnh 2</label>
                                            <div class="row ckfinder-group">
                                                <div class="col-10">
                                                    <input type="text" class="form-control image-render" name="home_slide[slide_image_2][]" placeholder="Đường dẫn ảnh..." value=""/>
                                                </div>
                                                <div class="col-2">
                                                    <button type="button" class="btn btn-success btn-block choose-image"><i class="fa fa-upload" aria-hidden="true"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Mô tả</label>
                                            <textarea name="home_slide[slide_desc][]" class="form-control" placeholder="Mô tả slide..."></textarea>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Ảnh nền</label>
                                            <div class="row ckfinder-group">
                                                <div class="col-10">
                                                    <input type="text" class="form-control image-render" name="home_slide[slide_bg][]" placeholder="Đường dẫn ảnh..." value=""/>
                                                </div>
                                                <div class="col-2">
                                                    <button type="button" class="btn btn-success btn-block choose-image"><i class="fa fa-upload" aria-hidden="true"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-6">
                                                    <div class="form-group">
                                                        <label for="">Vị trí</label>
                                                        <select name="home_slide[slide_position][]" class="form-control">
                                                            <option value="left">Trái</option>
                                                            <option value="center">Giữa</option>
                                                            <option value="right">Phải</option>
                                                        </select>
                                                    </div>
                                                </div>
                                </div>

                            </div>
                        </div>
                    </div><!--End .slide-item-->`;
const addSlideObject = document.querySelector('.add-slide');
const slideWrapperObject = document.querySelector('.slide-wrapper');
if (addSlideObject!==null && slideWrapperObject!==null){
    addSlideObject.addEventListener('click', function(){
        let slideItemHtmlNode = new DOMParser().parseFromString(slideItemHtml, 'text/html').querySelector('.slide-item');

        slideWrapperObject.appendChild(slideItemHtmlNode);

        openCkfinder();
    });

    slideWrapperObject.addEventListener('click', function(e){
        e.preventDefault(); //Ngăn tình trạng mặc định html (Thẻ a)
        if (e.target.classList.contains('remove') || e.target.parentElement.classList.contains('remove')){

            if (confirm('Bạn có chắc chắn muốn xoá?')){
                let slideItem = e.target;
                while (slideItem) {

                    slideItem = slideItem.parentElement;

                    if (slideItem.classList.contains('slide-item')) {
                        break;
                    }
                }

                if (slideItem !== null) {
                    slideItem.remove();
                }

            }
        }
    });

    const skillItemHtml = `<div class="skill-item">
                        <div class="row">
                            <div class="col-11">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Tên năng lực</label>
                                            <input type="text" class="form-control" name="home_about[skill][name][]" placeholder="Tên năng lực..."/>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label for="">Giá trị</label>
                                        <input type="text" class="ranger form-control" name="home_about[skill][value][]"/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-1">
                                <a href="#" class="btn btn-danger btn-sm btn-block remove">&times;</a>
                            </div>
                        </div>
                    </div><!--End .skill-item-->`;

    const addSkillObject = document.querySelector('.add-skill');
    const skillWrapperObject = document.querySelector('.skill-wrapper');
    if (addSkillObject!==null && skillWrapperObject!==null) {
        addSkillObject.addEventListener('click', function () {
            let skillItemHtmlNode = new DOMParser().parseFromString(skillItemHtml, 'text/html').querySelector('.skill-item');

            skillWrapperObject.appendChild(skillItemHtmlNode);

            openCkfinder();

            $('.ranger').ionRangeSlider({
                min     : 0,
                max     : 100,
                type    : 'single',
                step    : 1,
                postfix : ' %',
                prettify: false,
                hasGrid : true
            })
        });

        skillWrapperObject.addEventListener('click', function (e) {
            e.preventDefault(); //Ngăn tình trạng mặc định html (Thẻ a)
            if (e.target.classList.contains('remove') || e.target.parentElement.classList.contains('remove')) {

                if (confirm('Bạn có chắc chắn muốn xoá?')) {
                    let skillItem = e.target;
                    while (skillItem) {

                        skillItem = skillItem.parentElement;

                        if (skillItem.classList.contains('skill-item')) {
                            break;
                        }
                    }

                    if (skillItem !== null) {
                        skillItem.remove();
                    }

                }
            }
        });

    }

    $('.ranger').ionRangeSlider({
        min     : 0,
        max     : 100,
        type    : 'single',
        step    : 1,
        postfix : ' %',
        prettify: false,
        hasGrid : true
    })
}


const partnerItemHtml = `<div class="partner-item">
                        <div class="row">
                            <div class="col-11">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Logo</label>
                                            <div class="row ckfinder-group">
                                                <div class="col-10">
                                                    <input type="text" class="form-control image-render" name="home_partner_content[logo][]" placeholder="Đường dẫn ảnh..." value=""/>
                                                </div>
                                                <div class="col-2">
                                                    <button type="button" class="btn btn-success btn-block choose-image"><i class="fa fa-upload" aria-hidden="true"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="">Link</label>
                                            <input type="text" class="form-control" name="home_partner_content[link][]" placeholder="Link..."/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-1">
                                <a href="#" class="btn btn-danger btn-sm btn-block remove">&times;</a>
                            </div>
                        </div>
                    </div><!--End .partner-item-->`;

const addPartnerObject = document.querySelector('.add-partner');
const partnerWrapperObject = document.querySelector('.partner-wrapper');
if (addPartnerObject!==null && partnerWrapperObject!==null) {
    addPartnerObject.addEventListener('click', function () {
        let partnerItemHtmlNode = new DOMParser().parseFromString(partnerItemHtml, 'text/html').querySelector('.partner-item');

        partnerWrapperObject.appendChild(partnerItemHtmlNode);

        openCkfinder();

    });

    partnerWrapperObject.addEventListener('click', function (e) {
        e.preventDefault(); //Ngăn tình trạng mặc định html (Thẻ a)
        if (e.target.classList.contains('remove') || e.target.parentElement.classList.contains('remove')) {

            if (confirm('Bạn có chắc chắn muốn xoá?')) {
                let partnerItem = e.target;
                while (partnerItem) {

                    partnerItem = partnerItem.parentElement;

                    if (partnerItem.classList.contains('partner-item')) {
                        break;
                    }
                }

                if (partnerItem !== null) {
                    partnerItem.remove();
                }

            }
        }
    });

}

