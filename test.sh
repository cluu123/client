#!/bin/sh

# INFO="\033[44;30m INFO \033[0m"
eslint="node_modules/.bin/eslint"

# echo "WALL_MSG" | wall
# "$find" > 1.txt

# sed -i -n "s/1//g" 1.txt
# exit 1

gawk -F ':' '{ for (i = 1; i <= NF; i++) printf $i }' ./asdad.txt


# a=$(echo "$eslint" | sed -E "s/i.*//")

# echo $(nl 1.txt)
# echo $a
# exit 0

# 查看经常操作的命令
# cat ~/.bash_history | sort | uniq -c | sort -r | head -3
# 查看主机用户
# grep -n HID /etc/passwd
# 检测文件的空白行 wc 统计文本数据 -r 字节 -w 字数 -l 行
# grep -E '^$' '1.txt' | wc -l
# 检查用户家目录中的test.sh文件是否存在，并且检查是否有执行权限
# [ -f ~/test.sh ] && [ -x ~/test.sh ]
# if [ -x test.sh ];
# then '存在'
# else '不存在'
# fi;
# 随机数 -d删除指定 -dc删除指定之外    -c子节数
# LC_CTYPE=C sed -E 's/[^a-zA-Z0-9]//g' < /dev/urandom | head -c 6
# git@git.bilibili.co:kfptfe/innerIndex.git
# grep -r import 'src' | awk -F ':' '/^src/ {OFS=":"; printf $0}'
# 操作符 | & > >> &> &>> <
# | 管道操作 将一个命令的输出传输到下一个命令的输入
# & 后台运行 command & 后台运行
# > 重定向符 将一个输出写入一个文件(覆盖)
# &> 重定向符 将一个输出(包含错误输出)写入一个文件(覆盖)


# cat 1.txt | awk -F ':' '$1>20 {print $1}'

# find=$(find src -type f -name "*.js")

# result=$(echo "$find" | sed -E 's/src\/main.js//')

# echo "$result"

# trap "fun" SIGINT
# function fun() {
#     echo 2121
#     exit 0
# }

# eslint 检测
# for file in $find;
# do
#     $eslint "--fix" $file
#     if [[ "$?" == 0 ]];
#     then echo "\033[031;043m 检测通过 \033[0m $file"
#     else echo "\033[032;045m 检测失败 \033[0m $file"
#     fi
# done

# 查找文件 文件操作
# find . -type f -name '*.html'  # 查找文件
# grep -rnl 'div' ./src # 查找文件内符合字符串 -r 递归  -n打印行号 -E 使用正则  -l仅显示文件名
# sed -i '' '/div/i\
# 123123' index.html  # 处理文件内容 -i直接修改 可以接字符串表明复制文件后缀名   a i 追加文本必须\ 且换行
# sed -i '' '/div/d' index.html  # d删除 p 复制 
# sed -i '' 's/div/span/g' index.html # g 全局匹配
# echo "-----------for循环实现乘法表-----------"

# for i in {1..9};
# do
#     for j in {1..9}
#         do
#             if [[ $i -ge $j ]];
#             then  printf "$i*$j=$(($i*$j)) "
#             else  
#                 echo "\n"
#                 break
#             fi
#     done
#     # echo "\n"
# done
# echo "\n完成"

# let i=1
# while ((i < 9))
# do
#     let j=1
#     while ((j < 9))
#         do
#             let j+=1
#             if [[ $i -ge $j ]];
#             then  printf "$i*$j=$(($i*$j)) "
#             else  
#                 echo "\n"
#                 break
#             fi
#     done
# let i+=1
# done

# read -p 提示 -t 5 NAME
# echo $?

# echo 22
# echo "*/1 * * * * ./test.sh" > test111
# crontab test111
# rm test111

# sed -i '' -E "s/.*//" test111

# echo "" > test111


# 定时任务 * * * * *  分 时 日 月 星期  ,  -  /   0 0 * * * 每天灵成
# "0 0 * * *" > test111
# crontab test111
# rm test111
# crontab -l

# sed -i -E s/1//g 1.txt

# wc -l "1.txt"

# max_usage=$(df -h | awk '$5 ~ /%/ { sub("%", "", $5); if ($5 > max) { max=$5; partition=$1 } } END { print partition, max }')
# echo $max_usage

# df -l -h
# df -h | awk '$5 ~ /*%/ {printf "%s, %s\n", $1, $5}'

# ip 地址访问
# read -p 请输入一个地址 ip

# ping -c 1 -w 3 $ip > /dev/null

# if [[ $? -eq 0 ]];
# then echo "\0ee[32;43m $ip 能访问\033[0m"; exit 0
# else echo "\033[31;43m $ip 访问不了\033[0m"; exit 1
# fi

# 批两替换git源
read -p '请输入工作文件夹' work_dir
path=$(pwd)
currentPath=$(echo $path | sed -E "s/$work_dir.*/$work_dir/")
if [[ ! -d $currentPath ]];
then exit 1;
fi;
# dir=$(find $currentPath -type d -name .git )
git_repos=$(find /Users/cq/Desktop/work -type d -name .git)
repos_array=($git_repos)

# 打印所有找到的git仓库目录
for repo in "${repos_array[@]}"
do
    echo "$repo"
done
# for i in $dir;
# do 
#     currDir=$currentPath/$i
#     echo $currDir
# done;
# echo $dir