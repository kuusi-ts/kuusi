echo "Initializing kuusi example project";
echo "I know this script is bad, I suck at bash. Kuusi is good tho I pinky promise.";

mkdir kuusiApp;
cd kuusiApp;

mkdir src;
mkdir customRoutesDir;

declare -a arr=("deno.json" "kuusi.config.ts" "my.env" "myRequired.env" "customRoutesDir/:id.source.ts" "customRoutesDir/dotenv.source.ts" "customRoutesDir/index.source.ts" "customRoutesDir/kuusi.source.ts" "customRoutesDir/subscribe.hook.ts")

for i in "${arr[@]}"
do 
  touch $i;
  curl https://raw.githubusercontent.com/kuusi-ts/kuusi/refs/heads/main/example/$i >> $i;
done

echo "To get started, follow these steps";
echo "  1. Cd into the directory with `cd kuusiApp`";
echo "  2. Run `deno install`;

cd ../;
