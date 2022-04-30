#!/bin/bash
dir=docs
public=docs/public
branch=docs

generate() {
  jekyll build
}

echo -e "\033[0;32mDeleting docs/public...\033[0m"
rm -rf $public

echo -e "\033[0;32mChecking out $branch....\033[0m"
git worktree add $public $branch

echo -e "\033[0;32mGenerating Documentation...\033[0m"
cd $dir && build_command &&

echo -e "\033[0;32mDeploying $branch branch...\033[0m"
cd $directory && git add --all && git commit -m "Deploy updates" && git push origin $branch

echo -e "\033[0;32mCleaning up...\033[0m"
git worktree remove $directory
