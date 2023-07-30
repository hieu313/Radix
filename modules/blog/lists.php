<?php
if (!defined('_INCODE')) die('Access Deined...');


$filter = '';
$body = getBody();
//Xử lý lọc theo user
if (isGet()) {
    if (!empty($body['user_id'])){
        $userId = $body['user_id'];

        if (!empty($filter) &&strpos($filter, 'WHERE')>=0){

            $operator = 'AND';

        }else{
            $operator = 'WHERE';
        }

        $filter.= " $operator blog.user_id=$userId";
    }
}
//Xử lý thuật toán phân trang
$allBlogNum = getRows("SELECT id FROM blog $filter");


$perPage = getOption('blog_per_page')?getOption('blog_per_page'):9;

$maxPage = ceil($allBlogNum/$perPage);

if (!empty(getBody()['page'])){
    $page = getBody()['page'];
    if ($page<1 || $page>$maxPage){
        $page = 1;
    }
}else{
    $page = 1;
}

$offset = ($page-1)*$perPage;

//Truy vấn blog
$listBlog = getRaw("SELECT title, description, blog.id, thumbnail, view_count, blog.create_at, blog_categories.name as cate_name, blog_categories.id AS cate_id  FROM blog INNER JOIN blog_categories ON blog.category_id=blog_categories.id $filter ORDER BY blog.create_at DESC LIMIT $offset, $perPage");
$pageTitle = getOption('blog_title');
if (!empty($userId)) {
    $userDetail = firstRaw("SELECT fullname FROM users WHERE id = $userId");
    $pageTitle = getOption('blog_title').' Của '.$userDetail['fullname'];
}

$data = [
    'pageTitle' => $pageTitle
];
layout('header', 'client', $data);

layout('breadcrumb', 'client', $data);

?>
    <section class="blogs-main archives section">
        <div class="container">
            <?php
            if (!empty($listBlog)):
            ?>
            <div class="row">
                <?php foreach ($listBlog as $item): ?>

                <div class="col-lg-4 col-md-6 col-12">
                    <!-- Single Blog -->
                    <div class="single-blog">
                        <div class="blog-head">
                            <img src="<?php echo $item['thumbnail']; ?>" alt="#">
                        </div>
                        <div class="blog-bottom">
                            <div class="blog-inner">
                                <h4><a href="<?php echo _WEB_HOST_ROOT.'?module=blog&action=detail&id='.$item['id']; ?>"><?php echo $item['title']; ?></a></h4>
                                <p><?php echo $item['description']; ?></p>
                                <div class="meta">
                                    <span><i class="fa fa-bolt"></i><a href="<?php echo _WEB_HOST_ROOT.'?module=blog&action=category&id='.$item['cate_id']; ?>""><?php echo $item['cate_name']; ?></a></span>
                                    <span><i class="fa fa-calendar"></i><?php echo getDateFormat($item['create_at'], 'd/m/Y'); ?></span>
                                    <span><i class="fa fa-eye"></i><a href="#"><?php echo $item['view_count']; ?></a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End Single Blog -->
                </div>
                <?php endforeach; ?>
            </div>
            <?php
                $begin = $page-2;
                if ($begin<1){
                    $begin = 1;
                }
                $end = $page+2;
                if ($end>$maxPage){
                    $end = $maxPage;
                }

                if ($maxPage>1):
            ?>
            <div class="row">
                <div class="col-12">
                    <!-- Start Pagination -->
                    <div class="pagination-main">
                        <ul class="pagination">
                            <?php
//                           phân trang theo người đăng
                            $userLink ='';
                            if (!empty($userId)) {
                                $userLink = '&user_id='.$userId;
                            }
                            ?>

                            <?php
                            if ($page>1){
                                $prevPage = $page-1;
                                echo '<li class="prev"><a href="'._WEB_HOST_ROOT.'?module=blog'.$userLink.'&page='.$prevPage.'"><i class="fa fa-angle-double-left"></i></a></li>';
                            }
                    for ($index = $begin; $index<=$end; $index++){
                        $classActive = ($page==$index)?'active':false;
                        echo '<li class="'.$classActive.'"><a href="'._WEB_HOST_ROOT.'?module=blog'.$userLink.'&page='.$index.'">'.$index.'</a></li>';
                    }
                            if ($page<$maxPage){
                                $nextPage = $page+1;
                                echo '<li class="next"><a href="'._WEB_HOST_ROOT.'?module=blog&'.$userLink.'page='.$nextPage.'"><i class="fa fa-angle-double-right"></i></a></li>';
                            }
                            ?>

                        </ul>
                    </div>
                    <!--/ End Pagination -->
                </div>
            </div>
            <?php endif; ?>
            <?php else: ?>
                <div class="alert alert-info text-center">Không có bài viết</div>
            <?php endif; ?>
        </div>
    </section>
<?php

layout('footer', 'client');