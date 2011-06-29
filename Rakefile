require 'rubygems'

HEADER = /((^\s*\/\/.*\n)+)/

desc "rebuild the tinycolor.js files for distribution"
task :build do
  begin
    require 'closure-compiler'
  rescue LoadError
    puts "closure-compiler not found.\nInstall it by running 'gem install closure-compiler"
    exit
  end
  source = File.read 'tinycolor.js'
  header = source.match(HEADER)
  File.open('tinycolor-min.js', 'w+') do |file|
    file.write header[1].squeeze(' ') + Closure::Compiler.new.compress(source)
  end
end
